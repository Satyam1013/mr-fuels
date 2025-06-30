"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PlanSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const admin_schema_1 = require("../admin/admin.schema");
const mongoose_2 = require("mongoose");
let PlanSchedulerService = PlanSchedulerService_1 = class PlanSchedulerService {
    constructor(adminModel) {
        this.adminModel = adminModel;
        this.logger = new common_1.Logger(PlanSchedulerService_1.name);
    }
    async handlePlanUpgrade() {
        try {
            const now = new Date();
            const expiredAdmins = await this.adminModel.find({
                planType: "free",
                planExpiresAt: { $lte: now },
            });
            if (expiredAdmins.length === 0) {
                this.logger.log("No admins found for plan update");
                return;
            }
            const result = await this.adminModel.updateMany({
                planType: "free",
                planExpiresAt: { $lte: now },
            }, { $set: { planType: "paid" } });
            this.logger.log(`Plans updated to paid: ${result.modifiedCount}`);
        }
        catch (err) {
            this.logger.error("Error in plan upgrade cron job", err);
        }
    }
};
exports.PlanSchedulerService = PlanSchedulerService;
__decorate([
    (0, schedule_1.Cron)("59 23 * * 0"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlanSchedulerService.prototype, "handlePlanUpgrade", null);
exports.PlanSchedulerService = PlanSchedulerService = PlanSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PlanSchedulerService);
//# sourceMappingURL=plan-scheduler.service.js.map