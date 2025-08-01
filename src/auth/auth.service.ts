/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Model, Types } from "mongoose";
import { Admin, AdminDocument } from "../admin/admin.schema";
import { CreateAdminDto } from "./create-user.dto";
import { ConfigService } from "@nestjs/config";
import { Plan } from "../plan/plan.schema";
import {
  SuperAdminLoginDto,
  SuperAdminSignupDto,
} from "../super-admin/super-admin.dto";
import {
  SuperAdmin,
  SuperAdminDocument,
} from "../super-admin/super-admin.schema";
import { PlanEnum } from "../common/types";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(SuperAdmin.name)
    private superAdminModel: Model<SuperAdminDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async superAdminSignup(dto: SuperAdminSignupDto) {
    const existing = await this.superAdminModel.findOne({
      $or: [{ email: dto.email }, { mobile: dto.mobile }],
    });

    if (existing) {
      throw new BadRequestException("Super admin already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newSuperAdmin = new this.superAdminModel({
      ...dto,
      password: hashedPassword,
    });

    await newSuperAdmin.save();

    return { message: "Super admin registered successfully" };
  }

  async superAdminLogin(dto: SuperAdminLoginDto) {
    const superAdmin = await this.superAdminModel.findOne({
      email: dto.email,
    });

    if (!superAdmin) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isValid = await bcrypt.compare(dto.password, superAdmin.password);

    if (!isValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload = {
      sub: superAdmin._id,
      email: superAdmin.email,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_SECRET"),
      expiresIn: "1h",
    });

    return {
      message: "Login successful",
      access_token,
    };
  }

  async adminSignup(body: CreateAdminDto) {
    try {
      const {
        businessDetails,
        machineDetails,
        pumpDetails,
        managers,
        adminPassword,
      } = body;

      // 1. Check if admin email already exists
      const existingEmail = await this.adminModel.findOne({
        businessEmail: businessDetails.businessEmail,
      });
      if (existingEmail) throw new ForbiddenException("Admin already exists");

      // 2. Check if admin mobile number already used
      const existingMobile = await this.adminModel.findOne({
        mobileNo: businessDetails.businessPhoneNo,
      });
      if (existingMobile)
        throw new ForbiddenException(
          "Mobile number already in use by another admin",
        );

      // 3. Check manager mobile uniqueness among themselves
      const managerMobiles = managers.map((m) => m.mobile);
      if (new Set(managerMobiles).size !== managerMobiles.length) {
        throw new ForbiddenException("Manager mobile numbers must be unique");
      }

      // 4. Check if any manager has same mobile as admin
      if (managerMobiles.includes(businessDetails.businessPhoneNo)) {
        throw new ForbiddenException(
          "A manager cannot have the same mobile number as the admin",
        );
      }

      // 5. Check if any manager's mobile already used in another admin's manager
      const usedInOtherAdmins = await this.adminModel.find({
        "managers.mobile": { $in: managerMobiles },
      });
      if (usedInOtherAdmins.length > 0) {
        throw new ForbiddenException(
          "One or more manager mobile numbers are already in use",
        );
      }

      // 6. Hash admin password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // 7. Hash each manager's password
      const managersWithHashedPasswords = await Promise.all(
        managers.map(async (m) => ({
          name: m.name,
          mobile: m.mobile,
          shift: m.shift,
          aadhar: m.aadhar,
          password: await bcrypt.hash(m.password, 10),
        })),
      );

      // 8. Create new admin document
      const admin = new this.adminModel({
        businessEmail: businessDetails.businessEmail,
        businessName: businessDetails.businessName,
        mobileNo: businessDetails.businessPhoneNo,
        fuelTypes: businessDetails.fuelTypes,
        fuels: businessDetails.fuels,
        machines: machineDetails.machines,
        businessUpiApps: pumpDetails.businessUpiApps,
        swipeStatement: pumpDetails.swipeStatement,
        bankDeposit: pumpDetails.bankDeposit,
        noOfEmployeeShifts: pumpDetails.noOfEmployeeShifts,
        shiftDetails: pumpDetails.shiftDetails,
        managers: managersWithHashedPasswords,
        password: hashedPassword,

        planType: PlanEnum.FREE,
        freeTrial: false,
        freeTrialAttempt: false,
        paidUser: false,
        activeAccount: false,
        startDate: new Date(),
      });

      await admin.save();
      admin.pumpId = admin._id as Types.ObjectId;
      await admin.save();

      return {
        message: "Admin created successfully",
        admin: {
          businessEmail: businessDetails.businessEmail,
          businessName: businessDetails.businessName,
          mobileNo: businessDetails.businessPhoneNo,
        },
      };
    } catch (error) {
      console.error("Error in adminSignup:", error);
      throw new InternalServerErrorException("Failed to signup admin");
    }
  }

  async checkUsedMobiles(numbers: string) {
    if (!numbers) throw new BadRequestException("No mobile numbers provided");

    const mobileArray = numbers.split(",").map((m) => m.trim());

    const usedAdmins = await this.adminModel.find({
      $or: [
        { mobileNo: { $in: mobileArray } },
        { "managers.mobile": { $in: mobileArray } },
      ],
    });

    const usedMobiles = new Set<string>();

    for (const admin of usedAdmins) {
      if (mobileArray.includes(admin.mobileNo)) {
        usedMobiles.add(admin.mobileNo);
      }
      admin.managers?.forEach((m) => {
        if (mobileArray.includes(m.mobile)) {
          usedMobiles.add(m.mobile);
        }
      });
    }

    return { usedMobiles: Array.from(usedMobiles) };
  }

  async login(mobileNo: string, password: string) {
    try {
      // 1. Try as Admin
      const adminDoc = await this.adminModel
        .findOne({ mobileNo })
        .populate("plan");

      if (adminDoc) {
        const admin = adminDoc as AdminDocument & { plan: Plan };

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) throw new UnauthorizedException("Invalid password");

        const payload = {
          sub: admin._id,
          mobileNo,
          role: "admin",
          pumpId: admin._id,
        };

        const access_token = this.jwtService.sign(payload, {
          secret: this.configService.get("JWT_SECRET"),
          expiresIn: "1h",
        });

        const refresh_token = this.jwtService.sign(payload, {
          secret: this.configService.get("JWT_REFRESH_SECRET"),
          expiresIn: "7d",
        });

        admin.refreshToken = refresh_token;
        await admin.save();

        return {
          message: "Admin logged in",
          access_token,
          refresh_token,
          role: "admin",
        };
      }

      // 2. Try as Manager
      const adminWithManagerDoc = await this.adminModel
        .findOne({ "managers.mobile": mobileNo })
        .populate("plan");

      if (!adminWithManagerDoc)
        throw new UnauthorizedException("User not found");

      const adminWithManager = adminWithManagerDoc as AdminDocument & {
        plan: Plan;
      };

      const manager = adminWithManager.managers.find(
        (m) => m.mobile === mobileNo,
      );
      if (!manager) throw new UnauthorizedException("Manager not found");

      const isValidManagerPassword = await bcrypt.compare(
        password,
        manager.password,
      );
      if (!isValidManagerPassword)
        throw new UnauthorizedException("Invalid password");

      const payload = {
        sub: manager.mobile,
        role: "manager",
        mobileNo: manager.mobile,
        shift: manager.shift,
        pumpId: adminWithManager._id,
        adminId: adminWithManager._id,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_SECRET"),
        expiresIn: "1h",
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      });

      await this.adminModel.updateOne(
        {
          _id: adminWithManager._id,
          "managers.mobile": mobileNo,
        },
        {
          $set: {
            "managers.$.refreshToken": refresh_token,
          },
        },
      );

      return {
        message: "Manager logged in",
        access_token,
        refresh_token,
        role: "manager",
      };
    } catch (error) {
      console.error("Unified login error:", error);
      throw new InternalServerErrorException("Login failed");
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });

      const admin = await this.adminModel.findById(payload.sub);

      if (!admin || admin.refreshToken !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const newAccessToken = this.jwtService.sign(
        { sub: admin._id, mobileNo: admin.mobileNo },
        {
          secret: this.configService.get("JWT_SECRET"),
          expiresIn: "1h",
        },
      );

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async logout(mobileNo: string, role: "admin" | "manager") {
    try {
      if (role === "admin") {
        const admin = await this.adminModel.findOne({ mobileNo });
        if (!admin) throw new UnauthorizedException("Admin not found");

        admin.refreshToken = null;
        await admin.save();
        return { message: "Admin logged out successfully" };
      }

      if (role === "manager") {
        const result = await this.adminModel.updateOne(
          { "managers.mobile": mobileNo },
          {
            $set: {
              "managers.$.refreshToken": null,
            },
          },
        );

        if (result.modifiedCount === 0) {
          throw new UnauthorizedException(
            "Manager not found or already logged out",
          );
        }

        return { message: "Manager logged out successfully" };
      }

      throw new UnauthorizedException("Invalid role");
    } catch (error) {
      console.error("Logout error:", error);
      throw new InternalServerErrorException("Logout failed");
    }
  }
}
