import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { Admin } from "../admin/admin.schema";
import { AdminLoginDto, CreateAdminDto } from "./create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async adminSignup(createAdminDto: CreateAdminDto) {
    try {
      const { password, confirmPassword, ...rest } = createAdminDto;

      if (password !== confirmPassword) {
        throw new BadRequestException("Passwords do not match");
      }

      const existing = await this.adminModel.findOne({ email: rest.email });
      if (existing) {
        throw new BadRequestException("Admin already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await this.adminModel.create({
        ...rest,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({
        adminId: admin._id,
        role: "admin",
      });

      return {
        message: "Signup successful",
        token,
        admin: {
          _id: admin._id,
          mobileNo: admin.mobileNo,
          businessName: admin.businessName,
          setupComplete: admin.setupComplete,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BadRequestException("Error creating admin: " + errorMessage);
    }
  }

  async adminLogin(dto: AdminLoginDto) {
    const { mobileNo, password } = dto;

    const admin = await this.adminModel.findOne({ mobileNo });
    if (!admin) {
      throw new UnauthorizedException("Invalid mobile number or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid mobile number or password");
    }

    const token = this.jwtService.sign({
      adminId: admin._id,
      role: "admin",
    });

    return {
      message: "Login successful",
      token,
      admin: {
        _id: admin._id,
        mobileNo: admin.mobileNo,
        businessName: admin.businessName,
        setupComplete: admin.setupComplete,
      },
    };
  }
}
