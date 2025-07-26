"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const admin_module_1 = require("./admin/admin.module");
const auth_module_1 = require("./auth/auth.module");
const plan_module_1 = require("./plan/plan.module");
const super_admin_module_1 = require("./super-admin/super-admin.module");
const home_module_1 = require("./home/home.module");
const pump_expenses_module_1 = require("./pump-expenses/pump-expenses.module");
const personal_expenses_module_1 = require("./personal-expenses/personal-expenses.module");
const creditors_module_1 = require("./creditors/creditors.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            schedule_1.ScheduleModule.forRoot(),
            super_admin_module_1.SuperAdminModule,
            pump_expenses_module_1.PumpExpenseModule,
            personal_expenses_module_1.PersonalExpenseModule,
            admin_module_1.AdminModule,
            auth_module_1.AuthModule,
            plan_module_1.PlanModule,
            home_module_1.HomeModule,
            creditors_module_1.CreditorModule,
        ],
        providers: [],
    })
], AppModule);
