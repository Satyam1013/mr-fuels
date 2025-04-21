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
exports.PumpDataController = void 0;
const common_1 = require("@nestjs/common");
const pump_data_service_1 = require("./pump-data.service");
const pump_data_dto_1 = require("./pump-data.dto");
let PumpDataController = class PumpDataController {
    constructor(pumpDataService) {
        this.pumpDataService = pumpDataService;
    }
    getPumpData(date, type) {
        return this.pumpDataService.getPumpData(date, type);
    }
};
exports.PumpDataController = PumpDataController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("date")),
    __param(1, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PumpDataController.prototype, "getPumpData", null);
exports.PumpDataController = PumpDataController = __decorate([
    (0, common_1.Controller)("pump-data"),
    __metadata("design:paramtypes", [pump_data_service_1.PumpDataService])
], PumpDataController);
//# sourceMappingURL=pump-data.controller.js.map