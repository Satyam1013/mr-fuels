"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalExpenseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const personal_expense_controller_1 = require("./personal-expense.controller");
const personal_expense_service_1 = require("./personal-expense.service");
const personal_expense_schema_1 = require("./personal-expense.schema");
let PersonalExpenseModule = class PersonalExpenseModule {
};
exports.PersonalExpenseModule = PersonalExpenseModule;
exports.PersonalExpenseModule = PersonalExpenseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: personal_expense_schema_1.PersonalExpense.name, schema: personal_expense_schema_1.PersonalExpenseSchema },
            ]),
        ],
        controllers: [personal_expense_controller_1.PersonalExpenseController],
        providers: [personal_expense_service_1.PersonalExpenseService],
    })
], PersonalExpenseModule);
