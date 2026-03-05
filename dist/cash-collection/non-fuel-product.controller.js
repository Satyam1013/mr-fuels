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
exports.NonFuelProductController = void 0;
const common_1 = require("@nestjs/common");
const non_fuel_product_service_1 = require("./non-fuel-product.service");
let NonFuelProductController = class NonFuelProductController {
    constructor(nonFuelService) {
        this.nonFuelService = nonFuelService;
    }
    async addProducts(req, dtos) {
        return this.nonFuelService.addProducts(req.user.adminId, dtos);
    }
    async getProducts(req) {
        return this.nonFuelService.getProducts(req.user.adminId);
    }
    async deleteProduct(id) {
        return this.nonFuelService.deleteProduct(id);
    }
};
exports.NonFuelProductController = NonFuelProductController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], NonFuelProductController.prototype, "addProducts", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NonFuelProductController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NonFuelProductController.prototype, "deleteProduct", null);
exports.NonFuelProductController = NonFuelProductController = __decorate([
    (0, common_1.Controller)("non-fuel-products"),
    __metadata("design:paramtypes", [non_fuel_product_service_1.NonFuelProductService])
], NonFuelProductController);
