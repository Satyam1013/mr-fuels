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
import { User, UserDocument, UserRole } from "src/user/user.schema";
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
        managerDetails,
        adminPassword,
      } = body;

      const existing = await this.adminModel.findOne({
        businessEmail: businessDetails.businessEmail,
      });

      if (existing) throw new ForbiddenException("Admin already exists");

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

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
        managers: managerDetails.managers.map((m) => ({
          name: m.name,
          mobile: m.mobile,
          aadhar: m.aadhar,
          shift: m.shift,
          password: m.password,
        })),
        password: hashedPassword,
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

  async managerLogin(managerName: string, managerPassword: string) {
    try {
      const manager = await this.userModel.findOne({ managerName });
      if (!manager) throw new UnauthorizedException("Manager not found");

      const valid = await bcrypt.compare(
        managerPassword,
        manager.managerPassword,
      );
      if (!valid) throw new UnauthorizedException("Invalid password");

      if (manager.role !== UserRole.MANAGER) {
        throw new ForbiddenException("Not a manager account");
      }

      const payload = {
        sub: manager._id,
        managerName: manager.managerName,
        role: manager.role,
      };

      return {
        message: "Manager logged in",
        access_token: this.jwtService.sign(payload),
        manager: {
          managerName: manager.managerName,
          managerMobile: manager.managerMobile,
          shift: manager.shift,
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
