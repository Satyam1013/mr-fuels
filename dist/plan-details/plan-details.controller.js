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
exports.PlanController = void 0;
const common_1 = require("@nestjs/common");
const plan_details_service_1 = require("./plan-details.service");
const plan_details_dto_1 = require("./plan-details.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let PlanController = class PlanController {
    constructor(planService) {
        this.planService = planService;
    }
    create(planDetailsDto) {
        return this.planService.create(planDetailsDto);
    }
    findAll(adminId) {
        return this.planService.findAll(adminId);
    }
    findByName(name) {
        return this.planService.findByName(name);
    }
};
exports.PlanController = PlanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [plan_details_dto_1.PlanDetailsDto]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":name"),
    __param(0, (0, common_1.Param)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "findByName", null);
exports.PlanController = PlanController = __decorate([
    (0, common_1.Controller)("plans"),
    __metadata("design:paramtypes", [plan_details_service_1.PlanService])
], PlanController);
