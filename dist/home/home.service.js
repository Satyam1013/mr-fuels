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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pump_expenses_schema_1 = require("../pump-expenses/pump-expenses.schema");
const home_dto_1 = require("./home.dto");
const dayjs_1 = __importDefault(require("dayjs"));
let HomeService = class HomeService {
    constructor(pumpExpenseModel) {
        this.pumpExpenseModel = pumpExpenseModel;
    }
    async getPumpExpenseByFilter(filterType, baseDate) {
        const date = (0, dayjs_1.default)(baseDate);
        let startDate;
        let endDate;
        if (filterType === home_dto_1.FilterType.DAILY) {
            startDate = date.startOf("day").toDate();
            endDate = date.endOf("day").toDate();
        }
        else if (filterType === home_dto_1.FilterType.WEEKLY) {
            startDate = date.startOf("week").toDate();
            endDate = date.endOf("week").toDate();
        }
        else {
            // monthly
            startDate = date.startOf("month").toDate();
            endDate = date.endOf("month").toDate();
        }
        const data = await this.pumpExpenseModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$entries" },
            {
                $group: {
                    _id: "$entries.category",
                    totalAmount: { $sum: "$entries.amount" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    category: "$_id",
                    totalAmount: 1,
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        return {
            filterType,
            range: { startDate, endDate },
            categories: data,
        };
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pump_expenses_schema_1.PumpExpense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HomeService);
