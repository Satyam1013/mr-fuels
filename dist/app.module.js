"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./auth/auth.module");
const pump_details_module_1 = require("./pump-details/pump-details.module");
const managers_module_1 = require("./managers/managers.module");
const staff_module_1 = require("./staff/staff.module");
const transactions_module_1 = require("./transactions/transactions.module");
const product_details_module_1 = require("./product-details/product-details.module");
const machines_module_1 = require("./machines/machines.module");
const dsr_module_1 = require("./dsr/dsr.module");
const plan_details_module_1 = require("./plan-details/plan-details.module");
const non_fuel_product_module_1 = require("./non-fuel-product/non-fuel-product.module");
const home_module_1 = require("./home/home.module");
const tank_details_module_1 = require("./tank-details/tank-details.module");
const pump_status_module_1 = require("./pump-status/pump-status.module");
const sales_module_1 = require("./sales/sales.module");
const shift_machine_module_1 = require("./shift-machine/shift-machine.module");
const creditors_module_1 = require("./creditors/creditors.module");
const pump_expense_module_1 = require("./pump-expense/pump-expense.module");
const personal_expense_module_1 = require("./personal-expense/personal-expense.module");
const prepaid_module_1 = require("./prepaid/prepaid.module");
const cash_collection_module_1 = require("./cash-collection/cash-collection.module");
const digital_payment_module_1 = require("./digital-payment/digital-payment.module");
const machine_calculation_module_1 = require("./machine-calculation/machine-calculation.module");
const non_fuel_product_sales_module_1 = require("./non-fuel-product-sales/non-fuel-product-sales.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            pump_details_module_1.PumpDetailsModule,
            managers_module_1.ManagerModule,
            staff_module_1.StaffModule,
            transactions_module_1.TransactionDetailsModule,
            product_details_module_1.ProductDetailsModule,
            machines_module_1.MachineModule,
            dsr_module_1.DsrDetailsModule,
            plan_details_module_1.PlanModule,
            non_fuel_product_module_1.NonFuelProductsModule,
            home_module_1.HomeModule,
            tank_details_module_1.TankModule,
            pump_status_module_1.PumpStatusModule,
            sales_module_1.SalesModule,
            shift_machine_module_1.ShiftMachineModule,
            creditors_module_1.CreditorModule,
            pump_expense_module_1.PumpExpenseModule,
            personal_expense_module_1.PersonalExpenseModule,
            prepaid_module_1.PrepaidModule,
            cash_collection_module_1.CashCollectionModule,
            digital_payment_module_1.DigitalPaymentModule,
            machine_calculation_module_1.MachineCalculationModule,
            non_fuel_product_sales_module_1.NonFuelProductSellModule,
        ],
        providers: [],
    })
], AppModule);
