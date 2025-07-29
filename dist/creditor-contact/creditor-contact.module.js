"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditorContactModule = void 0;
const common_1 = require("@nestjs/common");
const creditor_contact_controller_1 = require("./creditor-contact.controller");
const creditor_contact_service_1 = require("./creditor-contact.service");
const mongoose_1 = require("@nestjs/mongoose");
const creditor_contact_schema_1 = require("./creditor-contact.schema");
const auth_module_1 = require("../auth/auth.module");
let CreditorContactModule = class CreditorContactModule {
};
exports.CreditorContactModule = CreditorContactModule;
exports.CreditorContactModule = CreditorContactModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: creditor_contact_schema_1.CreditorContact.name, schema: creditor_contact_schema_1.CreditorContactSchema },
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [creditor_contact_controller_1.CreditorContactController],
        providers: [creditor_contact_service_1.CreditorContactService],
        exports: [mongoose_1.MongooseModule],
    })
], CreditorContactModule);
