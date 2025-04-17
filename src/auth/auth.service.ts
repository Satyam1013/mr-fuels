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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Admin Signup
  async adminSignup(email: string, password: string) {
    try {
      const existing = await this.adminModel.findOne({ email });
      if (existing) throw new ForbiddenException("Admin already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new this.adminModel({ email, password: hashedPassword });
      await admin.save();

      return {
        message: "Admin created successfully",
        admin: { email: admin.email },
      };
    } catch (error) {
      console.error("Error in adminSignup:", error);
      throw new InternalServerErrorException("Failed to signup admin");
    }
  }

  // Admin Login
  async adminLogin(email: string, password: string) {
    try {
      const admin = await this.adminModel.findOne({
        email,
      });
      if (!admin) throw new UnauthorizedException("Admin not found");

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) throw new UnauthorizedException("Invalid password");

      const payload = { email: admin.email, sub: admin._id };
      return {
        message: "Admin logged in",
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error("Error in adminLogin:", error);
      throw new InternalServerErrorException("Failed to login admin");
    }
  }

  // Manager Login
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
        username: manager.username,
        sub: manager._id,
        role: manager.role,
      };

      return {
        message: "Manager logged in",
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error("Error in managerLogin:", error);
      throw new InternalServerErrorException("Failed to login manager");
    }
  }
}
