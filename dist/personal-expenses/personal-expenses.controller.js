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
exports.PersonalExpenseController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const home_dto_1 = require("../home/home.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const auth_guard_1 = require("../auth/auth.guard");
const personal_expenses_dto_1 = require("./personal-expenses.dto");
const personal_expenses_service_1 = require("./personal-expenses.service");
let PersonalExpenseController = class PersonalExpenseController {
    constructor(personalExpenseService) {
        this.personalExpenseService = personalExpenseService;
    }
    async create(dto, files, pumpId) {
        return this.personalExpenseService.create(dto, files?.images || [], pumpId);
    }
    findAll(pumpId, date, filterType) {
        return this.personalExpenseService.findAll(pumpId, date, filterType);
    }
    findOne(id) {
        return this.personalExpenseService.findById(id);
    }
    update(id, dto) {
        return this.personalExpenseService.update(id, dto);
    }
    remove(id) {
        return this.personalExpenseService.delete(id);
    }
};
exports.PersonalExpenseController = PersonalExpenseController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: "images", maxCount: 10 }])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [personal_expenses_dto_1.CreatePersonalExpenseDto, Object, String]),
    __metadata("design:returntype", Promise)
], PersonalExpenseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("pumpId")),
    __param(1, (0, common_1.Query)("date")),
    __param(2, (0, common_1.Query)("filterType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PersonalExpenseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonalExpenseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, personal_expenses_dto_1.UpdatePersonalExpenseDto]),
    __metadata("design:returntype", void 0)
], PersonalExpenseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonalExpenseController.prototype, "remove", null);
exports.PersonalExpenseController = PersonalExpenseController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)("personal-expense"),
    __metadata("design:paramtypes", [personal_expenses_service_1.PersonalExpenseService])
], PersonalExpenseController);
