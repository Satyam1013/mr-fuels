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
exports.NonFuelProductsController = void 0;
const common_1 = require("@nestjs/common");
const non_fuel_product_service_1 = require("./non-fuel-product.service");
const non_fuel_product_dto_1 = require("./non-fuel-product.dto");
let NonFuelProductsController = class NonFuelProductsController {
    constructor(nonFuelService) {
        this.nonFuelService = nonFuelService;
    }
    create(req, dto) {
        return this.nonFuelService.create(req.user.adminId, dto);
    }
    getAll(req) {
        return this.nonFuelService.getAll(req.user.adminId);
    }
};
exports.NonFuelProductsController = NonFuelProductsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, non_fuel_product_dto_1.CreateNonFuelProductsDto]),
    __metadata("design:returntype", void 0)
], NonFuelProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NonFuelProductsController.prototype, "getAll", null);
exports.NonFuelProductsController = NonFuelProductsController = __decorate([
    (0, common_1.Controller)("non-fuel-products"),
    __metadata("design:paramtypes", [non_fuel_product_service_1.NonFuelProductsService])
], NonFuelProductsController);
