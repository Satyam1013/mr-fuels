"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const sells_controller_1 = require("./sells.controller");
const sells_service_1 = require("./sells.service");
const sells_schema_1 = require("./sells.schema");
const admin_schema_1 = require("../admin/admin.schema");
const machines_schema_1 = require("../machines/machines.schema");
const transactions_schema_1 = require("../transactions/transactions.schema");
const staff_schema_1 = require("../staff/staff.schema");
const pump_details_schema_1 = require("../pump-details/pump-details.schema");
const non_fuel_product_sell_schema_1 = require("../non-fuel-product-sell/non-fuel-product-sell.schema");
let SellsModule = class SellsModule {
};
exports.SellsModule = SellsModule;
exports.SellsModule = SellsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: sells_schema_1.Sells.name, schema: sells_schema_1.SellsSchema },
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
                { name: machines_schema_1.Machine.name, schema: machines_schema_1.MachineSchema },
                { name: transactions_schema_1.TransactionDetails.name, schema: transactions_schema_1.TransactionDetailsSchema },
                { name: non_fuel_product_sell_schema_1.NonFuelSellProduct.name, schema: non_fuel_product_sell_schema_1.NonFuelSellProductSchema },
                { name: staff_schema_1.Staff.name, schema: staff_schema_1.StaffSchema },
                { name: pump_details_schema_1.PumpDetails.name, schema: pump_details_schema_1.PumpDetailsSchema },
            ]),
        ],
        controllers: [sells_controller_1.SellsController],
        providers: [sells_service_1.SellsService],
    })
], SellsModule);
