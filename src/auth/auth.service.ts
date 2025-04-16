/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../admin/admin.service";
import * as bcrypt from "bcryptjs";
import { User, UserDocument, UserRole } from "src/user/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Admin Signup
  async adminSignup(email: string, password: string) {
    const existing = await this.adminService.findByEmail(email);
    if (existing) throw new ForbiddenException("Admin already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.adminService.createUser({
      email,
      password: hashedPassword,
    });

    return {
      message: "Admin created successfully",
      admin: { email: admin.email },
    };
  }

  // Admin Login
  async adminLogin(email: string, password: string) {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) throw new UnauthorizedException("Admin not found");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException("Invalid password");

    const payload = { email: admin.email, sub: admin._id, role: admin.role };
    return {
      message: "Admin logged in",
      access_token: this.jwtService.sign(payload),
    };
  }

  // Manager Login
  async managerLogin(username: string, password: string) {
    const manager = await this.adminService.findByUsername(username);
    if (!manager) throw new UnauthorizedException("Manager not found");

    const valid = await bcrypt.compare(password, manager.password);
    if (!valid) throw new UnauthorizedException("Invalid password");

    if (manager.role !== UserRole.MANAGER)
      throw new ForbiddenException("Not a manager account");

    const payload = {
      username: manager.username,
      sub: manager._id,
      role: manager.role,
    };

    return {
      message: "Manager logged in",
      access_token: this.jwtService.sign(payload),
    };
  }
}
