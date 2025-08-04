"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditorModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const creditors_schema_1 = require("./creditors.schema");
const creditors_controller_1 = require("./creditors.controller");
const creditors_service_1 = require("./creditors.service");
const creditor_contact_module_1 = require("../creditor-contact/creditor-contact.module");
let CreditorModule = class CreditorModule {
};
exports.CreditorModule = CreditorModule;
exports.CreditorModule = CreditorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: creditors_schema_1.Creditor.name, schema: creditors_schema_1.CreditorSchema },
            ]),
            creditor_contact_module_1.CreditorContactModule,
        ],
        controllers: [creditors_controller_1.CreditorController],
        providers: [creditors_service_1.CreditorService],
        exports: [mongoose_1.MongooseModule],
    })
], CreditorModule);
