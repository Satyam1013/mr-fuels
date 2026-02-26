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
exports.PlanService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_details_schema_1 = require("./plan-details.schema");
const plan_details_enums_1 = require("./plan-details.enums");
const subscription_schema_1 = require("../subscription/subscription.schema");
let PlanService = class PlanService {
    constructor(planModel, subscriptionModel) {
        this.planModel = planModel;
        this.subscriptionModel = subscriptionModel;
    }
    formatName(plan) {
        if (plan.duration.durationType === plan_details_enums_1.DurationType.YEARLY) {
            return `${plan.name.toUpperCase()} Yearly`;
        }
        if (plan.duration.durationType === plan_details_enums_1.DurationType.MONTHLY) {
            return `${plan.name.toUpperCase()} Monthly`;
        }
        return `${plan.name.toUpperCase()} Trial`;
    }
    getDurationLabel(plan) {
        if (plan.duration.durationType === plan_details_enums_1.DurationType.YEARLY) {
            return "1 Year";
        }
        if (plan.duration.durationType === plan_details_enums_1.DurationType.MONTHLY) {
            return `${plan.duration.months} Month`;
        }
        return "Trial";
    }
    getHighlightTag(plan) {
        if (plan.tags?.mostPopular)
            return "Popular";
        if (plan.tags?.discounted)
            return "Best Value";
        if (plan.tags?.freeTrial)
            return "Free Trial";
        return "";
    }
    async create(planDetailsDto) {
        const plan = new this.planModel(planDetailsDto);
        return plan.save();
    }
    async findAll(adminId) {
        // 🔎 Check if user has already used trial
        const usedTrial = await this.subscriptionModel.exists({
            adminId,
            isTrial: true,
        });
        const plans = await this.planModel.find({ status: "active" }).lean();
        const quarterly = [];
        const yearly = [];
        for (const plan of plans) {
            // 🚫 Skip trial plan if already used
            if (plan.duration.durationType === plan_details_enums_1.DurationType.TRIAL && usedTrial) {
                continue;
            }
            const formatted = {
                planId: plan._id,
                code: plan.name,
                name: this.formatName(plan),
                description: plan.description,
                price: `₹${plan.pricing.finalPrice}`,
                durationLabel: this.getDurationLabel(plan),
                highlightTag: this.getHighlightTag(plan),
            };
            if (plan.duration.durationType === plan_details_enums_1.DurationType.YEARLY) {
                yearly.push(formatted);
            }
            else {
                quarterly.push(formatted);
            }
        }
        return { quarterly, yearly };
    }
    async findByName(name) {
        return this.planModel.findOne({ name }).exec();
    }
};
exports.PlanService = PlanService;
exports.PlanService = PlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plan_details_schema_1.Plan.name)),
    __param(1, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PlanService);
