"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineCalculationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const machine_calculation_schema_1 = require("./machine-calculation.schema");
const machine_calculation_service_1 = require("./machine-calculation.service");
const machine_calculation_controller_1 = require("./machine-calculation.controller");
const pump_expense_schema_1 = require("../pump-expense/pump-expense.schema");
const prepaid_schema_1 = require("../prepaid/prepaid.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
const creditors_schema_1 = require("../creditors/creditors.schema");
let MachineCalculationModule = class MachineCalculationModule {
};
exports.MachineCalculationModule = MachineCalculationModule;
exports.MachineCalculationModule = MachineCalculationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: machine_calculation_schema_1.MachineCalculation.name, schema: machine_calculation_schema_1.MachineCalculationSchema },
                { name: pump_expense_schema_1.PumpExpense.name, schema: pump_expense_schema_1.PumpExpenseSchema },
                { name: prepaid_schema_1.Prepaid.name, schema: prepaid_schema_1.PrepaidSchema },
                { name: non_fuel_product_schema_1.NonFuelProduct.name, schema: non_fuel_product_schema_1.NonFuelProductSchema },
                { name: creditors_schema_1.Creditor.name, schema: creditors_schema_1.CreditorSchema },
            ]),
        ],
        controllers: [machine_calculation_controller_1.MachineCalculationController],
        providers: [machine_calculation_service_1.MachineCalculationService],
    })
], MachineCalculationModule);
