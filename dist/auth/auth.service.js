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
let AuthService = class AuthService {
    constructor(adminModel, jwtService, configService) {
        this.adminModel = adminModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async adminSignup(body) {
        try {
            const { businessDetails, machineDetails, pumpDetails, managers, adminPassword, } = body;
            const existingEmail = await this.adminModel.findOne({
                businessEmail: businessDetails.businessEmail,
            });
            if (existingEmail)
                throw new common_1.ForbiddenException("Admin already exists");
            const existingMobile = await this.adminModel.findOne({
                mobileNo: businessDetails.businessPhoneNo,
            });
            if (existingMobile)
                throw new common_1.ForbiddenException("Mobile number already in use by another admin");
            const managerMobiles = managers.map((m) => m.mobile);
            if (new Set(managerMobiles).size !== managerMobiles.length) {
                throw new common_1.ForbiddenException("Manager mobile numbers must be unique");
            }
            if (managerMobiles.includes(businessDetails.businessPhoneNo)) {
                throw new common_1.ForbiddenException("A manager cannot have the same mobile number as the admin");
            }
            const usedInOtherAdmins = await this.adminModel.find({
                "managers.mobile": { $in: managerMobiles },
            });
            if (usedInOtherAdmins.length > 0) {
                throw new common_1.ForbiddenException("One or more manager mobile numbers are already in use");
            }
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const managersWithHashedPasswords = await Promise.all(managers.map(async (m) => ({
                name: m.name,
                mobile: m.mobile,
                shift: m.shift,
                aadhar: m.aadhar,
                password: await bcrypt.hash(m.password, 10),
            })));
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
                freeTrial: false,
                freeTrialAttempt: false,
                paidUser: false,
                activeAccount: false,
                startDate: new Date(),
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
        }
        catch (error) {
            console.error("Error in adminSignup:", error);
            throw new common_1.InternalServerErrorException("Failed to signup admin");
        }
    }
    async login(mobileNo, password) {
        try {
            const adminDoc = await this.adminModel
                .findOne({ mobileNo })
                .populate("plan");
            if (adminDoc) {
                const admin = adminDoc;
                const isValid = await bcrypt.compare(password, admin.password);
                if (!isValid)
                    throw new common_1.UnauthorizedException("Invalid password");
                const payload = { sub: admin._id, mobileNo, role: "admin" };
                const access_token = this.jwtService.sign(payload, {
                    secret: this.configService.get("JWT_SECRET"),
                    expiresIn: "1h",
                });
                const refresh_token = this.jwtService.sign(payload, {
                    secret: this.configService.get("JWT_REFRESH_SECRET"),
                    expiresIn: "7d",
                });
                admin.refreshToken = refresh_token;
                await admin.save();
                return {
                    message: "Admin logged in",
                    access_token,
                    refresh_token,
                    role: "admin",
                };
            }
            const adminWithManagerDoc = await this.adminModel
                .findOne({ "managers.mobile": mobileNo })
                .populate("plan");
            if (!adminWithManagerDoc)
                throw new common_1.UnauthorizedException("User not found");
            const adminWithManager = adminWithManagerDoc;
            const manager = adminWithManager.managers.find((m) => m.mobile === mobileNo);
            if (!manager)
                throw new common_1.UnauthorizedException("Manager not found");
            const isValidManagerPassword = await bcrypt.compare(password, manager.password);
            if (!isValidManagerPassword)
                throw new common_1.UnauthorizedException("Invalid password");
            const payload = {
                sub: manager.mobile,
                role: "manager",
                mobileNo,
                shift: manager.shift,
                adminId: adminWithManager._id,
            };
            const access_token = this.jwtService.sign(payload, {
                secret: this.configService.get("JWT_SECRET"),
                expiresIn: "1h",
            });
            const refresh_token = this.jwtService.sign(payload, {
                secret: this.configService.get("JWT_REFRESH_SECRET"),
                expiresIn: "7d",
            });
            await this.adminModel.updateOne({
                _id: adminWithManager._id,
                "managers.mobile": mobileNo,
            }, {
                $set: {
                    "managers.$.refreshToken": refresh_token,
                },
            });
            return {
                message: "Manager logged in",
                access_token,
                refresh_token,
                role: "manager",
            };
        }
        catch (error) {
            console.error("Unified login error:", error);
            throw new common_1.InternalServerErrorException("Login failed");
        }
    }
    async refreshAccessToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get("JWT_REFRESH_SECRET"),
            });
            const admin = await this.adminModel.findById(payload.sub);
            if (!admin || admin.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException("Invalid refresh token");
            }
            const newAccessToken = this.jwtService.sign({ sub: admin._id, mobileNo: admin.mobileNo }, {
                secret: this.configService.get("JWT_SECRET"),
                expiresIn: "1h",
            });
            return {
                access_token: newAccessToken,
            };
        }
        catch (error) {
            console.error("Error refreshing token:", error);
            throw new common_1.UnauthorizedException("Invalid or expired refresh token");
        }
    }
    async logout(mobileNo, role) {
        try {
            if (role === "admin") {
                const admin = await this.adminModel.findOne({ mobileNo });
                if (!admin)
                    throw new common_1.UnauthorizedException("Admin not found");
                admin.refreshToken = null;
                await admin.save();
                return { message: "Admin logged out successfully" };
            }
            if (role === "manager") {
                const result = await this.adminModel.updateOne({ "managers.mobile": mobileNo }, {
                    $set: {
                        "managers.$.refreshToken": null,
                    },
                });
                if (result.modifiedCount === 0) {
                    throw new common_1.UnauthorizedException("Manager not found or already logged out");
                }
                return { message: "Manager logged out successfully" };
            }
            throw new common_1.UnauthorizedException("Invalid role");
        }
        catch (error) {
            console.error("Logout error:", error);
            throw new common_1.InternalServerErrorException("Logout failed");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map