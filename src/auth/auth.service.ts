/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "src/user/user.schema";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { Admin, AdminDocument } from "src/admin/admin.schema";
import { CreateAdminDto } from "./create-user.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
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
        planType: "free",
        planExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });

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

  async adminLogin(mobileNo: string, password: string) {
    try {
      const admin = await this.adminModel.findOne({ mobileNo });
      if (!admin) throw new UnauthorizedException("Admin not found");

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) throw new UnauthorizedException("Invalid password");

      const payload = { sub: admin._id, mobileNo: admin.mobileNo };

      const access_token = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_SECRET"),
        expiresIn: "1h",
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      });

      // Save refresh token to DB
      admin.refreshToken = refresh_token;
      await admin.save();

      return {
        message: "Admin logged in",
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error("Error in adminLogin:", error);
      throw new InternalServerErrorException("Failed to login admin");
    }
  }

  async managerLogin(mobileNo: string, managerPassword: string) {
    try {
      // Find admin who has this manager
      const admin = await this.adminModel.findOne({
        "managers.mobile": mobileNo,
      });
      if (!admin) throw new UnauthorizedException("Manager not found");

      // Get the matching manager
      const manager = admin.managers.find((m) => m.mobile === mobileNo);
      if (!manager) throw new UnauthorizedException("Manager not found");

      // Compare password
      const valid = await bcrypt.compare(managerPassword, manager.password);
      if (!valid) throw new UnauthorizedException("Invalid password");

      const payload = {
        sub: admin._id, // or use manager._id if each manager has a unique ID (not in your current schema)
        mobileNo: manager.mobile,
        shift: manager.shift,
        role: "manager",
      };

      const token = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_SECRET"),
        expiresIn: "1h",
      });

      return {
        message: "Manager logged in",
        access_token: token,
        manager: {
          name: manager.name,
          mobile: manager.mobile,
          shift: manager.shift,
          businessEmail: admin.businessEmail,
        },
      };
    } catch (error) {
      console.error("Error in managerLogin:", error);
      throw new InternalServerErrorException("Failed to login manager");
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
}
