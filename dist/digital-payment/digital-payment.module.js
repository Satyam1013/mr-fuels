"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalPaymentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const digital_payment_controller_1 = require("./digital-payment.controller");
const digital_payment_service_1 = require("./digital-payment.service");
const digital_payment_schema_1 = require("./digital-payment.schema");
let DigitalPaymentModule = class DigitalPaymentModule {
};
exports.DigitalPaymentModule = DigitalPaymentModule;
exports.DigitalPaymentModule = DigitalPaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: digital_payment_schema_1.DigitalPayment.name, schema: digital_payment_schema_1.DigitalPaymentSchema },
            ]),
        ],
        controllers: [digital_payment_controller_1.DigitalPaymentController],
        providers: [digital_payment_service_1.DigitalPaymentService],
    })
], DigitalPaymentModule);
