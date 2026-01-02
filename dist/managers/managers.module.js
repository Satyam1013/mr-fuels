"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const managers_controller_1 = require("./managers.controller");
const managers_service_1 = require("./managers.service");
const managers_schema_1 = require("./managers.schema");
const admin_schema_1 = require("../admin/admin.schema");
let ManagerModule = class ManagerModule {
};
exports.ManagerModule = ManagerModule;
exports.ManagerModule = ManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: managers_schema_1.Manager.name, schema: managers_schema_1.ManagerSchema },
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
            ]),
        ],
        controllers: [managers_controller_1.ManagerController],
        providers: [managers_service_1.ManagerService],
    })
], ManagerModule);
