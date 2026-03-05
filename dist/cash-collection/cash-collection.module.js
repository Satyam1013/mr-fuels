"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashCollectionModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cash_collection_schema_1 = require("./cash-collection.schema");
const cash_collection_service_1 = require("./cash-collection.service");
const cash_collection_controller_1 = require("./cash-collection.controller");
const machines_schema_1 = require("../machines/machines.schema");
let CashCollectionModule = class CashCollectionModule {
};
exports.CashCollectionModule = CashCollectionModule;
exports.CashCollectionModule = CashCollectionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: cash_collection_schema_1.CashCollection.name, schema: cash_collection_schema_1.CashCollectionSchema },
                { name: machines_schema_1.Machine.name, schema: machines_schema_1.MachineSchema },
            ]),
        ],
        controllers: [cash_collection_controller_1.CashCollectionController],
        providers: [cash_collection_service_1.CashCollectionService],
    })
], CashCollectionModule);
