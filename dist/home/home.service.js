"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pump_expenses_schema_1 = require("../pump-expenses/pump-expenses.schema");
const date_1 = require("../utils/date");
const pump_expense_1 = require("../utils/pump-expense");
let HomeService = class HomeService {
    constructor(pumpExpenseModel) {
        this.pumpExpenseModel = pumpExpenseModel;
    }
    async getAll(filterType, baseDate) {
        const { startDate, endDate } = (0, date_1.getDateRange)(filterType, baseDate);
        const { pumpExpenseTotalAmount } = await (0, pump_expense_1.getPumpExpenseStats)(this.pumpExpenseModel, startDate, endDate);
        return [
            {
                filterType,
                categories: [
                    {
                        id: 1,
                        name: "Pump Expenses",
                        amount: pumpExpenseTotalAmount,
                    },
                    {
                        id: 2,
                        name: "Creditors",
                        amount: pumpExpenseTotalAmount,
                    },
                    {
                        id: 3,
                        name: "Personal Expenses",
                        amount: pumpExpenseTotalAmount,
                    },
                    {
                        id: 4,
                        name: "UPI Payment",
                        amount: pumpExpenseTotalAmount,
                    },
                    {
                        id: 5,
                        name: "Swipe Collection",
                        amount: pumpExpenseTotalAmount,
                    },
                ],
                sale: {
                    ltr: 20000,
                    amount: 10000,
                },
                collection: {
                    ltr: 20000,
                    amount: 10000,
                },
                collected: {
                    ltr: 20000,
                    amount: 10000,
                },
                deposited: {
                    ltr: 20000,
                    amount: 10000,
                },
                diff: {
                    ltr: 0,
                    amount: 0,
                },
                salesTarget: 25000,
                saleLastMonth: 20000,
                expensesLastMonth: 20,
            },
        ];
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pump_expenses_schema_1.PumpExpense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HomeService);
