"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftStatusModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const shift_status_schema_1 = require("./shift-status.schema");
const shift_status_service_1 = require("./shift-status.service");
const shift_status_controller_1 = require("./shift-status.controller");
const pump_details_schema_1 = require("../pump-details/pump-details.schema");
const admin_schema_1 = require("../admin/admin.schema");
const managers_schema_1 = require("../managers/managers.schema");
const sales_schema_1 = require("../sales/sales.schema");
const machine_calculation_schema_1 = require("../machine-calculation/machine-calculation.schema");
const creditors_schema_1 = require("../creditors/creditors.schema");
const prepaid_schema_1 = require("../prepaid/prepaid.schema");
const non_fuel_product_sales_schema_1 = require("../non-fuel-product-sales/non-fuel-product-sales.schema");
const digital_payment_schema_1 = require("../digital-payment/digital-payment.schema");
const pump_expense_schema_1 = require("../pump-expense/pump-expense.schema");
const personal_expense_schema_1 = require("../personal-expense/personal-expense.schema");
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
const staff_schema_1 = require("../staff/staff.schema");
let ShiftStatusModule = class ShiftStatusModule {
};
exports.ShiftStatusModule = ShiftStatusModule;
exports.ShiftStatusModule = ShiftStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: shift_status_schema_1.ShiftStatus.name, schema: shift_status_schema_1.ShiftStatusSchema },
                { name: pump_details_schema_1.PumpDetails.name, schema: pump_details_schema_1.PumpDetailsSchema },
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
                { name: managers_schema_1.Manager.name, schema: managers_schema_1.ManagerSchema },
                { name: sales_schema_1.Sales.name, schema: sales_schema_1.SalesSchema },
                { name: machine_calculation_schema_1.MachineCalculation.name, schema: machine_calculation_schema_1.MachineCalculationSchema },
                { name: creditors_schema_1.Creditor.name, schema: creditors_schema_1.CreditorSchema },
                { name: prepaid_schema_1.Prepaid.name, schema: prepaid_schema_1.PrepaidSchema },
                { name: non_fuel_product_sales_schema_1.NonFuelSellProduct.name, schema: non_fuel_product_sales_schema_1.NonFuelSellProductSchema },
                { name: digital_payment_schema_1.DigitalPayment.name, schema: digital_payment_schema_1.DigitalPaymentSchema },
                { name: pump_expense_schema_1.PumpExpense.name, schema: pump_expense_schema_1.PumpExpenseSchema },
                { name: personal_expense_schema_1.PersonalExpense.name, schema: personal_expense_schema_1.PersonalExpenseSchema },
                { name: fuel_product_schema_1.FuelProductDetails.name, schema: fuel_product_schema_1.FuelProductDetailsSchema },
                { name: staff_schema_1.Staff.name, schema: staff_schema_1.StaffSchema },
            ]),
        ],
        controllers: [shift_status_controller_1.ShiftStatusController],
        providers: [shift_status_service_1.ShiftStatusService],
    })
], ShiftStatusModule);
