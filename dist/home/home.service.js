"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const home_dto_1 = require("./home.dto");
let HomeService = class HomeService {
    getHomeData(adminId, filter) {
        const { startDate, endDate } = this.getDateRange(filter);
        // 👉 Yaha aap DSR, Expenses, Tank etc collections se
        // date range ke according data fetch karoge
        return {
            homeData: {
                performance: {
                    totalSales: 150000,
                    avgDailySales: 5000,
                    uptime: "99.5%",
                    lastUpdated: new Date(),
                },
                pumpDetails: {
                    tankStatus: [
                        {
                            tankId: "T1",
                            fuelType: "Petrol",
                            capacity: 5000,
                            currentLevel: 3200,
                        },
                        {
                            tankId: "T2",
                            fuelType: "Diesel",
                            capacity: 8000,
                            currentLevel: 1500,
                        },
                    ],
                    recentEntries: {
                        creditors: [],
                        pumpExpenses: [],
                        personalExpenses: [],
                    },
                },
            },
            filterApplied: filter ?? "all",
            dateRange: {
                startDate,
                endDate,
            },
            message: "Home data fetched successfully",
            timestamp: new Date(),
        };
    }
    // 🔥 Date Range Calculator
    getDateRange(filter) {
        const now = new Date();
        let startDate;
        if (filter === home_dto_1.TimeFilter.WEEK) {
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
        }
        else if (filter === home_dto_1.TimeFilter.MONTH) {
            startDate = new Date();
            startDate.setMonth(now.getMonth() - 1);
        }
        else {
            startDate = new Date(0); // all time
        }
        return {
            startDate,
            endDate: now,
        };
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)()
], HomeService);
