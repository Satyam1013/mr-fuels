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
exports.CashCollectionController = void 0;
const common_1 = require("@nestjs/common");
const cash_collection_service_1 = require("./cash-collection.service");
const cash_collection_dto_1 = require("./cash-collection.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let CashCollectionController = class CashCollectionController {
    constructor(service) {
        this.service = service;
    }
    create(adminId, dto) {
        return this.service.create(adminId, dto);
    }
    findAll(adminId) {
        return this.service.findAll(adminId);
    }
    findOne(adminId, id) {
        return this.service.findOne(adminId, id);
    }
    update(adminId, id, dto) {
        return this.service.update(adminId, id, dto);
    }
    remove(adminId, id) {
        return this.service.remove(adminId, id);
    }
};
exports.CashCollectionController = CashCollectionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, cash_collection_dto_1.CreateCashCollectionDto]),
    __metadata("design:returntype", void 0)
], CashCollectionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", void 0)
], CashCollectionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String]),
    __metadata("design:returntype", void 0)
], CashCollectionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String, cash_collection_dto_1.UpdateCashCollectionDto]),
    __metadata("design:returntype", void 0)
], CashCollectionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String]),
    __metadata("design:returntype", void 0)
], CashCollectionController.prototype, "remove", null);
exports.CashCollectionController = CashCollectionController = __decorate([
    (0, common_1.Controller)("cash-collection"),
    __metadata("design:paramtypes", [cash_collection_service_1.CashCollectionService])
], CashCollectionController);
