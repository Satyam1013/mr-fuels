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
import { CreateAdminDto, CreateUserDto } from "./create-user.dto";

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
        businessEmail,
        password,
        businessName,
        mobileNo,
        tankCapacity,
        machines,
      } = body;

      const existing = await this.adminModel.findOne({ businessEmail });
      if (existing) throw new ForbiddenException("Admin already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = new this.adminModel({
        businessEmail,
        password: hashedPassword,
        businessName,
        mobileNo,
        tankCapacity,
        machines,
        managers: [],
      });

      await admin.save();

      return {
        message: "Admin created successfully",
        admin: {
          businessEmail,
          businessName,
          mobileNo,
        },
      };
    } catch (error) {
      console.error("Error in adminSignup:", error);
      throw new InternalServerErrorException("Failed to signup admin");
    }
  }
  async createManager(body: CreateUserDto) {
    try {
      const { username, password, mobile, role, aadharImage, shift } = body;

      if (role !== UserRole.MANAGER) {
        throw new ForbiddenException(
          "Only managers can be created from this route",
        );
      }

      const existingUser = await this.userModel.findOne({ username });
      if (existingUser) throw new ForbiddenException("Manager already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const manager = await this.userModel.create({
        username,
        password: hashedPassword,
        mobile,
        role,
        aadharImage,
        shift,
      });

      return {
        message: "Manager created successfully",
        manager: {
          username: manager.username,
          mobile: manager.mobile,
          role: manager.role,
          aadharImage: manager.aadharImage,
          shift: manager.shift,
        },
      };
    } catch (error) {
      console.error("Error in createManager:", error);
      throw new InternalServerErrorException("Failed to create manager");
    }
  }

  async adminLogin(email: string, password: string) {
    try {
      const admin = await this.adminModel.findOne({
        businessEmail: email,
      });
      if (!admin) throw new UnauthorizedException("Admin not found");

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) throw new UnauthorizedException("Invalid password");

      const payload = { email: admin.businessEmail, sub: admin._id };
      return {
        message: "Admin logged in",
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error("Error in adminLogin:", error);
      throw new InternalServerErrorException("Failed to login admin");
    }
  }

  async managerLogin(username: string, password: string) {
    try {
      const manager = await this.userModel.findOne({ username });
      if (!manager) throw new UnauthorizedException("Manager not found");

      const valid = await bcrypt.compare(password, manager.password);
      if (!valid) throw new UnauthorizedException("Invalid password");

      if (manager.role !== UserRole.MANAGER) {
        throw new ForbiddenException("Not a manager account");
      }

      const payload = {
        sub: manager._id,
        username: manager.username,
        role: manager.role,
      };

      return {
        message: "Manager logged in",
        access_token: this.jwtService.sign(payload),
        manager: {
          username: manager.username,
          mobile: manager.mobile,
          role: manager.role,
          shift: manager.shift,
          aadharImage: manager.aadharImage,
        },
      };
    } catch (error) {
      console.error("Error in managerLogin:", error);
      throw new InternalServerErrorException("Failed to login manager");
    }
  }
}
