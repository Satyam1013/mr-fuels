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
import { Subscription } from "../subscription/subscription.schema";

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

      const existing = await this.adminModel.findOne({
        mobileNo: rest.mobileNo,
      });

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

    const admin = await this.adminModel.findOne({ mobileNo }).populate({
      path: "currentSubscriptionId",
      populate: { path: "planId" },
    });

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

    const subscription = admin.currentSubscriptionId as Subscription | null;

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: admin._id,
        role: "admin",
        businessName: admin.businessName,
        mobileNo: admin.mobileNo,
        setupComplete: admin.setupComplete,
        newUser: false,
      },
      subscription: subscription
        ? {
            _id: subscription._id,
            status: subscription.status,
            startDate: subscription.startDate,
            expiryDate: subscription.expiryDate,
            isTrial: subscription.isTrial,
            plan: subscription.planId,
          }
        : null,
    };
  }
}
