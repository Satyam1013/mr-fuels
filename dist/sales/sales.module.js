"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const sales_controller_1 = require("./sales.controller");
const sales_service_1 = require("./sales.service");
const sales_schema_1 = require("./sales.schema");
const admin_schema_1 = require("../admin/admin.schema");
const machines_schema_1 = require("../machines/machines.schema");
const transactions_schema_1 = require("../transactions/transactions.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
const staff_schema_1 = require("../staff/staff.schema");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: sales_schema_1.Sales.name, schema: sales_schema_1.SalesSchema },
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
                { name: machines_schema_1.Machine.name, schema: machines_schema_1.MachineSchema },
                { name: transactions_schema_1.TransactionDetails.name, schema: transactions_schema_1.TransactionDetailsSchema },
                { name: non_fuel_product_schema_1.NonFuelProduct.name, schema: non_fuel_product_schema_1.NonFuelProductSchema },
                { name: staff_schema_1.Staff.name, schema: staff_schema_1.StaffSchema },
            ]),
        ],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService],
    })
], SalesModule);
