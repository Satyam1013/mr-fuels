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
exports.FuelProductController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const fuel_product_service_1 = require("./fuel-product.service");
const fuel_product_dto_1 = require("./fuel-product.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const fuel_type_enum_1 = require("../common/enums/fuel-type.enum");
let FuelProductController = class FuelProductController {
    constructor(fuelProductService) {
        this.fuelProductService = fuelProductService;
    }
    async create(adminId, dto) {
        return this.fuelProductService.create(adminId, dto);
    }
    async findAll(adminId) {
        return this.fuelProductService.findAll(adminId);
    }
    async findOne(adminId, fuelType) {
        return this.fuelProductService.findByFuelType(adminId, fuelType);
    }
    async updatePrice(adminId, dto) {
        return this.fuelProductService.updatePrice(adminId, dto);
    }
    async remove(adminId, fuelType) {
        return this.fuelProductService.remove(adminId, fuelType);
    }
};
exports.FuelProductController = FuelProductController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, fuel_product_dto_1.CreateFuelProductsDto]),
    __metadata("design:returntype", Promise)
], FuelProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], FuelProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":fuelType"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Param)("fuelType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String]),
    __metadata("design:returntype", Promise)
], FuelProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, fuel_product_dto_1.UpdateFuelProductsDto]),
    __metadata("design:returntype", Promise)
], FuelProductController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Delete)(":fuelType"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Param)("fuelType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String]),
    __metadata("design:returntype", Promise)
], FuelProductController.prototype, "remove", null);
exports.FuelProductController = FuelProductController = __decorate([
    (0, common_1.Controller)("fuel-product"),
    __metadata("design:paramtypes", [fuel_product_service_1.FuelProductService])
], FuelProductController);
