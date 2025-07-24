"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpExpenseModule = void 0;
// src/pump-expense/pump-expense.module.ts
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const pump_expenses_schema_1 = require("./pump-expenses.schema");
const pump_expenses_controller_1 = require("./pump-expenses.controller");
const pump_expenses_service_1 = require("./pump-expenses.service");
let PumpExpenseModule = class PumpExpenseModule {
};
exports.PumpExpenseModule = PumpExpenseModule;
exports.PumpExpenseModule = PumpExpenseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pump_expenses_schema_1.PumpExpense.name, schema: pump_expenses_schema_1.PumpExpenseSchema },
            ]),
        ],
        controllers: [pump_expenses_controller_1.PumpExpenseController],
        providers: [pump_expenses_service_1.PumpExpenseService],
    })
], PumpExpenseModule);
