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
exports.DSRController = void 0;
const common_1 = require("@nestjs/common");
const dsr_service_1 = require("./dsr.service");
const dsr_dto_1 = require("./dsr.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
let DSRController = class DSRController {
    constructor(dsrService) {
        this.dsrService = dsrService;
    }
    async create(dto, pumpId) {
        return this.dsrService.create(dto, pumpId);
    }
};
exports.DSRController = DSRController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dsr_dto_1.CreateDSRDto, String]),
    __metadata("design:returntype", Promise)
], DSRController.prototype, "create", null);
exports.DSRController = DSRController = __decorate([
    (0, common_1.Controller)("dsr"),
    __metadata("design:paramtypes", [dsr_service_1.DSRService])
], DSRController);
