import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { Admin, AdminDocument } from "../admin/admin.schema";
import { AdminLoginDto, CreateAdminDto } from "./create-user.dto";
import { ConfigService } from "@nestjs/config";
import {
  SuperAdminLoginDto,
  SuperAdminSignupDto,
} from "../super-admin/super-admin.dto";
import {
  SuperAdmin,
  SuperAdminDocument,
} from "../super-admin/super-admin.schema";

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

  async adminSignup(createAdminDto: CreateAdminDto) {
    const { password, confirmPassword, pumpDetails, ...rest } = createAdminDto;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const existing = await this.adminModel.findOne({ email: rest.email });
    if (existing) {
      throw new BadRequestException("Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const setupComplete = pumpDetails && Object.keys(pumpDetails).length > 0;

    const admin = await this.adminModel.create({
      ...rest,
      pumpDetails,
      password: hashedPassword,
      setupComplete,
    });

    return { message: "Admin created successfully", admin };
  }

  async adminLogin(dto: AdminLoginDto) {
    const { email, password } = dto;

    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email or password");
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
        email: admin.email,
        businessName: admin.businessName,
        setupComplete: admin.setupComplete,
      },
    };
  }

  // async addPumpDetails(dto: PumpDetailsDto) {
  //   if (!dto.signupId) {
  //     throw new BadRequestException("signupId is required");
  //   }

  //   // Find user
  //   const user = await this.adminModel.findById(dto.signupId);
  //   if (!user) throw new NotFoundException("User not found");

  //   // Push the pump data
  //   user.pumpDetails.push(dto);

  //   // Mark setup as complete
  //   user.setupComplete = true;

  //   await user.save();

  //   return {
  //     message: "Pump details added successfully",
  //     setupComplete: true,
  //     pumpDetailsCount: user.pumpDetails.length,
  //   };
  // }

  // async checkUsedMobiles(numbers: string) {
  //   if (!numbers) throw new BadRequestException("No mobile numbers provided");

  //   const mobileArray = numbers.split(",").map((m) => m.trim());

  //   const usedAdmins = await this.adminModel.find({
  //     $or: [
  //       { mobileNo: { $in: mobileArray } },
  //       { "managers.mobile": { $in: mobileArray } },
  //     ],
  //   });

  //   const usedMobiles = new Set<string>();

  //   for (const admin of usedAdmins) {
  //     if (mobileArray.includes(admin.mobileNo)) {
  //       usedMobiles.add(admin.mobileNo);
  //     }
  //     admin.managers?.forEach((m) => {
  //       if (mobileArray.includes(m.mobile)) {
  //         usedMobiles.add(m.mobile);
  //       }
  //     });
  //   }

  //   return { usedMobiles: Array.from(usedMobiles) };
  // }

  // async adminLogin(mobileNo: string, password: string) {
  //   try {
  //     const ACCESS_TTL =
  //       this.configService.get<string>("ACCESS_TOKEN_TTL") ?? "1h";
  //     const REFRESH_TTL =
  //       this.configService.get<string>("REFRESH_TOKEN_TTL") ?? "7d";

  //     // --- Try Admin ---
  //     const adminDoc = await this.adminModel
  //       .findOne({ mobileNo })
  //       .populate("plan");
  //     if (adminDoc) {
  //       const isValid = await bcrypt.compare(password, adminDoc.password);
  //       if (!isValid) throw new UnauthorizedException("Invalid password");

  //       const payload = {
  //         sub: adminDoc._id,
  //         role: "admin" as const,
  //         mobileNo: adminDoc.mobileNo,
  //         pumpId: adminDoc._id,
  //       };

  //       const access_token = await this.jwtService.signAsync(payload, {
  //         secret: this.configService.get("JWT_SECRET"),
  //         expiresIn: ACCESS_TTL,
  //       });
  //       const refresh_token = await this.jwtService.signAsync(payload, {
  //         secret: this.configService.get("JWT_REFRESH_SECRET"),
  //         expiresIn: REFRESH_TTL,
  //       });

  //       adminDoc.refreshToken = refresh_token;
  //       await adminDoc.save();

  //       return {
  //         message: "Admin logged in",
  //         access_token,
  //         refresh_token,
  //         role: "admin",
  //       };
  //     }

  //     // --- Try Manager ---
  //     const adminWithManager = await this.adminModel
  //       .findOne({ "managers.mobile": mobileNo })
  //       .populate("plan");
  //     if (!adminWithManager) throw new UnauthorizedException("User not found");

  //     const manager = adminWithManager.managers.find(
  //       (m) => m.mobile === mobileNo,
  //     );
  //     if (!manager) throw new UnauthorizedException("Manager not found");

  //     const isValidManagerPassword = await bcrypt.compare(
  //       password,
  //       manager.password,
  //     );
  //     if (!isValidManagerPassword)
  //       throw new UnauthorizedException("Invalid password");

  //     const payload = {
  //       sub: manager._id,
  //       role: "manager" as const,
  //       mobileNo: manager.mobile,
  //       shift: manager.shift,
  //       adminId: adminWithManager._id,
  //       pumpId: adminWithManager._id,
  //     };

  //     const access_token = await this.jwtService.signAsync(payload, {
  //       secret: this.configService.get("JWT_SECRET"),
  //       expiresIn: ACCESS_TTL,
  //     });
  //     const refresh_token = await this.jwtService.signAsync(payload, {
  //       secret: this.configService.get("JWT_REFRESH_SECRET"),
  //       expiresIn: REFRESH_TTL,
  //     });

  //     await this.adminModel.updateOne(
  //       { _id: adminWithManager._id, "managers._id": manager._id },
  //       { $set: { "managers.$.refreshToken": refresh_token } },
  //     );

  //     return {
  //       message: "Manager logged in",
  //       access_token,
  //       refresh_token,
  //       role: "manager",
  //     };
  //   } catch (err) {
  //     console.error("Unified login error:", err);
  //     throw new InternalServerErrorException("Login failed");
  //   }
  // }

  // async refreshAccessToken(refreshToken: string) {
  //   try {
  //     const ACCESS_TTL =
  //       this.configService.get<string>("ACCESS_TOKEN_TTL") ?? "1h";

  //     // allow a small clock skew (helps “expired too early” symptoms)
  //     const payload = await this.jwtService.verifyAsync<{
  //       sub: string;
  //       role: "admin" | "manager";
  //       mobileNo: string;
  //       pumpId?: string;
  //       adminId?: string;
  //       shift?: number;
  //     }>(refreshToken, {
  //       secret: this.configService.get("JWT_REFRESH_SECRET"),
  //       clockTolerance: 10, // seconds
  //     });

  //     if (payload.role === "admin") {
  //       const admin = await this.adminModel.findById(payload.sub);
  //       if (!admin || admin.refreshToken !== refreshToken) {
  //         throw new UnauthorizedException("Invalid refresh token");
  //       }

  //       const newAccess = await this.jwtService.signAsync(
  //         {
  //           sub: admin._id,
  //           role: "admin",
  //           mobileNo: admin.mobileNo,
  //           pumpId: admin._id,
  //         },
  //         {
  //           secret: this.configService.get("JWT_SECRET"),
  //           expiresIn: ACCESS_TTL,
  //         },
  //       );

  //       return { access_token: newAccess };
  //     }

  //     // role === 'manager'
  //     const admin = await this.adminModel.findById(payload.adminId);
  //     if (!admin) throw new UnauthorizedException("Invalid refresh token");

  //     const manager = admin.managers.find(
  //       (m) => m._id.toString() === payload.sub,
  //     );
  //     if (!manager || manager.refreshToken !== refreshToken) {
  //       throw new UnauthorizedException("Invalid refresh token");
  //     }

  //     const newAccess = await this.jwtService.signAsync(
  //       {
  //         sub: manager._id,
  //         role: "manager",
  //         mobileNo: manager.mobile,
  //         shift: manager.shift,
  //         adminId: admin._id,
  //         pumpId: admin._id,
  //       },
  //       { secret: this.configService.get("JWT_SECRET"), expiresIn: ACCESS_TTL },
  //     );

  //     return { access_token: newAccess };
  //   } catch (err) {
  //     console.error("Error refreshing token:", err);
  //     throw new UnauthorizedException("Invalid or expired refresh token");
  //   }
  // }

  // async logout(mobileNo: string, role: "admin" | "manager") {
  //   try {
  //     if (role === "admin") {
  //       const admin = await this.adminModel.findOne({ mobileNo });
  //       if (!admin) throw new UnauthorizedException("Admin not found");

  //       admin.refreshToken = null;
  //       await admin.save();
  //       return { message: "Admin logged out successfully" };
  //     }

  //     if (role === "manager") {
  //       const result = await this.adminModel.updateOne(
  //         { "managers.mobile": mobileNo },
  //         {
  //           $set: {
  //             "managers.$.refreshToken": null,
  //           },
  //         },
  //       );

  //       if (result.modifiedCount === 0) {
  //         throw new UnauthorizedException(
  //           "Manager not found or already logged out",
  //         );
  //       }

  //       return { message: "Manager logged out successfully" };
  //     }

  //     throw new UnauthorizedException("Invalid role");
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     throw new InternalServerErrorException("Logout failed");
  //   }
  // }
}
