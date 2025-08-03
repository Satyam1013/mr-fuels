"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRange = getDateRange;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const home_dto_1 = require("../home/home.dto");
dayjs_1.default.extend(utc_1.default);
function getDateRange(filterType, baseDate) {
    const date = dayjs_1.default.utc(baseDate);
    switch (filterType) {
        case home_dto_1.FilterType.DAILY:
            return {
                startDate: date.startOf("day").toDate(),
                endDate: date.endOf("day").toDate(),
            };
        case home_dto_1.FilterType.WEEKLY:
            return {
                startDate: date.startOf("week").toDate(),
                endDate: date.endOf("week").toDate(),
            };
        case home_dto_1.FilterType.MONTHLY:
        default:
            return {
                startDate: date.startOf("month").toDate(),
                endDate: date.endOf("month").toDate(),
            };
    }
}
