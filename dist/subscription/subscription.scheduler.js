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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionScheduler = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const subscription_schema_1 = require("./subscription.schema");
const subscription_enum_1 = require("./subscription.enum");
let SubscriptionScheduler = class SubscriptionScheduler {
    constructor(subscriptionModel) {
        this.subscriptionModel = subscriptionModel;
    }
    // ─── Har raat 12 baje chalega ─────────────────────────
    async expireSubscriptions() {
        const now = new Date();
        const result = await this.subscriptionModel.updateMany({
            status: subscription_enum_1.SubscriptionStatus.ACTIVE,
            expiryDate: { $lt: now }, // expiry date nikal gayi
        }, {
            $set: { status: subscription_enum_1.SubscriptionStatus.EXPIRED },
        });
        console.log(`✅ Expired ${result.modifiedCount} subscriptions`);
    }
};
exports.SubscriptionScheduler = SubscriptionScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionScheduler.prototype, "expireSubscriptions", null);
exports.SubscriptionScheduler = SubscriptionScheduler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SubscriptionScheduler);
