"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDetailsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const transactions_controller_1 = require("./transactions.controller");
const transactions_service_1 = require("./transactions.service");
const transactions_schema_1 = require("./transactions.schema");
const admin_schema_1 = require("../admin/admin.schema");
let TransactionDetailsModule = class TransactionDetailsModule {
};
exports.TransactionDetailsModule = TransactionDetailsModule;
exports.TransactionDetailsModule = TransactionDetailsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: transactions_schema_1.TransactionDetails.name,
                    schema: transactions_schema_1.TransactionDetailsSchema,
                },
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
            ]),
        ],
        controllers: [transactions_controller_1.TransactionDetailsController],
        providers: [transactions_service_1.TransactionDetailsService],
    })
], TransactionDetailsModule);
