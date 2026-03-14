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
exports.DigitalPaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const digital_payment_schema_1 = require("./digital-payment.schema");
let DigitalPaymentService = class DigitalPaymentService {
    constructor(digitalPaymentModel) {
        this.digitalPaymentModel = digitalPaymentModel;
    }
    async create(adminId, dto) {
        const data = new this.digitalPaymentModel({
            ...dto,
            adminId: new mongoose_2.Types.ObjectId(adminId),
        });
        return data.save();
    }
    async findAll(adminId) {
        return this.digitalPaymentModel.find({
            adminId: new mongoose_2.Types.ObjectId(adminId),
        });
    }
    async findByShift(adminId, date, shiftId) {
        return this.digitalPaymentModel.find({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            date,
            shiftId,
        });
    }
};
exports.DigitalPaymentService = DigitalPaymentService;
exports.DigitalPaymentService = DigitalPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(digital_payment_schema_1.DigitalPayment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DigitalPaymentService);
