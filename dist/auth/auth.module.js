"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
/* eslint-disable @typescript-eslint/require-await */
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const admin_module_1 = require("../admin/admin.module");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const config_1 = require("@nestjs/config");
const super_admin_module_1 = require("../super-admin/super-admin.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get("JWT_SECRET"),
                    signOptions: { expiresIn: "1h" },
                }),
            }),
            (0, common_1.forwardRef)(() => admin_module_1.AdminModule),
            super_admin_module_1.SuperAdminModule,
        ],
        providers: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
        exports: [jwt_1.JwtModule, auth_service_1.AuthService],
    })
], AuthModule);
