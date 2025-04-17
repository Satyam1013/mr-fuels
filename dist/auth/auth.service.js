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
const user_schema_1 = require("../user/user.schema");
const jwt_1 = require("@nestjs/jwt");
const mongoose_2 = require("mongoose");
const admin_schema_1 = require("../admin/admin.schema");
let AuthService = class AuthService {
    constructor(adminModel, userModel, jwtService) {
        this.adminModel = adminModel;
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async adminSignup(email, password) {
        try {
            const existing = await this.adminModel.findOne({ email });
            if (existing)
                throw new common_1.ForbiddenException("Admin already exists");
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new this.adminModel({ email, password: hashedPassword });
            await admin.save();
            return {
                message: "Admin created successfully",
                admin: { email: admin.email },
            };
        }
        catch (error) {
            console.error("Error in adminSignup:", error);
            throw new common_1.InternalServerErrorException("Failed to signup admin");
        }
    }
    async adminLogin(email, password) {
        try {
            const admin = await this.adminModel.findOne({
                email,
            });
            if (!admin)
                throw new common_1.UnauthorizedException("Admin not found");
            const valid = await bcrypt.compare(password, admin.password);
            if (!valid)
                throw new common_1.UnauthorizedException("Invalid password");
            const payload = { email: admin.email, sub: admin._id };
            return {
                message: "Admin logged in",
                access_token: this.jwtService.sign(payload),
            };
        }
        catch (error) {
            console.error("Error in adminLogin:", error);
            throw new common_1.InternalServerErrorException("Failed to login admin");
        }
    }
    async managerLogin(username, password) {
        try {
            const manager = await this.userModel.findOne({ username });
            if (!manager)
                throw new common_1.UnauthorizedException("Manager not found");
            const valid = await bcrypt.compare(password, manager.password);
            if (!valid)
                throw new common_1.UnauthorizedException("Invalid password");
            if (manager.role !== user_schema_1.UserRole.MANAGER) {
                throw new common_1.ForbiddenException("Not a manager account");
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
        }
        catch (error) {
            console.error("Error in managerLogin:", error);
            throw new common_1.InternalServerErrorException("Failed to login manager");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map