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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
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

      const payload = { mobileNo: admin.mobileNo, sub: admin._id };
      return {
        message: "Admin logged in",
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error("Error in adminLogin:", error);
      throw new InternalServerErrorException("Failed to login admin");
    }
  }

  async createManager(body: any) {
    try {
      const { managerName, managerPassword, managerMobile, shift, role } = body;

      if (role !== UserRole.MANAGER) {
        throw new ForbiddenException("Only managers can be created");
      }

      const existing = await this.userModel.findOne({ managerName });
      if (existing) {
        throw new ForbiddenException("Manager already exists");
      }

      const hashedPassword = await bcrypt.hash(managerPassword, 10);

      const manager = await this.userModel.create({
        managerName,
        managerPassword: hashedPassword,
        managerMobile,
        shift,
        role,
      });

      return {
        message: "Manager created successfully",
        manager: {
          managerName: manager.managerName,
          managerMobile: manager.managerMobile,
          shift: manager.shift,
        },
      };
    } catch (error) {
      console.error("Error in createManager:", error);
      throw new InternalServerErrorException("Failed to create manager");
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
}
