"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const mongoose_2 = require("mongoose");
const admin_schema_1 = require("../admin/admin.schema");
const config_1 = require("@nestjs/config");
const super_admin_schema_1 = require("../super-admin/super-admin.schema");
let AuthService = class AuthService {
    constructor(adminModel, superAdminModel, jwtService, configService) {
        this.adminModel = adminModel;
        this.superAdminModel = superAdminModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async superAdminSignup(dto) {
        const existing = await this.superAdminModel.findOne({
            $or: [{ email: dto.email }, { mobile: dto.mobile }],
        });
        if (existing) {
            throw new common_1.BadRequestException("Super admin already exists");
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newSuperAdmin = new this.superAdminModel({
            ...dto,
            password: hashedPassword,
        });
        await newSuperAdmin.save();
        return { message: "Super admin registered successfully" };
    }
    async superAdminLogin(dto) {
        const superAdmin = await this.superAdminModel.findOne({
            email: dto.email,
        });
        if (!superAdmin) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        const isValid = await bcrypt.compare(dto.password, superAdmin.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException("Invalid email or password");
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
    async adminSignup(createAdminDto) {
        try {
            const { password, confirmPassword, pumpDetails, ...rest } = createAdminDto;
            if (password !== confirmPassword) {
                throw new common_1.BadRequestException("Passwords do not match");
            }
            const existing = await this.adminModel.findOne({ email: rest.email });
            if (existing) {
                throw new common_1.BadRequestException("Admin already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const setupComplete = pumpDetails && Object.keys(pumpDetails).length > 0;
            const admin = await this.adminModel.create({
                ...rest,
                pumpDetails,
                password: hashedPassword,
                setupComplete,
            });
            // ---------------------------
            // ✅ Generate JWT Token
            // ---------------------------
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new common_1.BadRequestException("Error creating admin: " + errorMessage);
        }
    }
    async adminLogin(dto) {
        const { mobileNo, password } = dto;
        const admin = await this.adminModel.findOne({ mobileNo });
        if (!admin) {
            throw new common_1.UnauthorizedException("Invalid mobile number or password");
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException("Invalid mobile number or password");
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(1, (0, mongoose_1.InjectModel)(super_admin_schema_1.SuperAdmin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
