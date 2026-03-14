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
exports.TankController = void 0;
const common_1 = require("@nestjs/common");
const tank_details_service_1 = require("./tank-details.service");
const tank_details_dto_1 = require("./tank-details.dto");
let TankController = class TankController {
    constructor(tankService) {
        this.tankService = tankService;
    }
    create(req, dto) {
        return this.tankService.create(req.user.adminId, dto);
    }
    findAll(req) {
        return this.tankService.findAll(req.user.adminId);
    }
    findOne(id) {
        return this.tankService.findOne(id);
    }
    update(req, id, dto) {
        return this.tankService.update(req.user.adminId, id, dto);
    }
    remove(id) {
        return this.tankService.remove(id);
    }
};
exports.TankController = TankController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tank_details_dto_1.CreateTankDetailsDto]),
    __metadata("design:returntype", void 0)
], TankController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TankController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TankController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, tank_details_dto_1.UpdateTankDetailsDto]),
    __metadata("design:returntype", void 0)
], TankController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TankController.prototype, "remove", null);
exports.TankController = TankController = __decorate([
    (0, common_1.Controller)("tanks"),
    __metadata("design:paramtypes", [tank_details_service_1.TankService])
], TankController);
