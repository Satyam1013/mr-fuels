"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankDepositModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bank_deposit_controller_1 = require("./bank-deposit.controller");
const bank_deposit_service_1 = require("./bank-deposit.service");
const bank_deposit_schema_1 = require("./bank-deposit.schema");
let BankDepositModule = class BankDepositModule {
};
exports.BankDepositModule = BankDepositModule;
exports.BankDepositModule = BankDepositModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: bank_deposit_schema_1.BankDeposit.name, schema: bank_deposit_schema_1.BankDepositSchema },
            ]),
        ],
        controllers: [bank_deposit_controller_1.BankDepositController],
        providers: [bank_deposit_service_1.BankDepositService],
        exports: [bank_deposit_service_1.BankDepositService],
    })
], BankDepositModule);
