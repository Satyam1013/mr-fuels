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
const time_enum_1 = require("./time.enum");
let HomeService = class HomeService {
    // ✅ HOME DASHBOARD
    getHomeData(adminId, query) {
        const { startDate, endDate } = this.buildDateRange(query);
        return {
            homeData: {
                performance: [
                    {
                        type: "sells",
                        totalSells: 150000,
                        sellsTarget: 200000,
                        lastSells: "99.5%",
                        desc: "This shows performance of sells",
                    },
                    {
                        type: "discount",
                        totalDiscountGiven: 5000,
                        discountTarget: 8000,
                        lastDiscount: "62.5%",
                        desc: "This shows discount performance",
                    },
                    {
                        type: "pnl",
                        status: "profit",
                        amount: 35000,
                        lastStatus: "loss",
                        lastAmount: 10000,
                        desc: "This shows Profit & Loss performance",
                    },
                    {
                        type: "taxation",
                        taxCollected: 12000,
                        taxPaid: 10000,
                        pendingTax: 2000,
                        desc: "This shows taxation performance",
                    },
                ],
                recentEntries: {
                    creditors: [
                        {
                            id: "C001",
                            name: "Supplier A",
                            amount: 20000,
                            date: "2026-02-25",
                        },
                    ],
                    pumpExpenses: [
                        {
                            id: "PE001",
                            category: "Maintenance",
                            amount: 5000,
                            date: "2026-02-24",
                        },
                    ],
                    personalExpenses: [
                        {
                            id: "PX001",
                            category: "Travel",
                            amount: 3000,
                            date: "2026-02-23",
                        },
                    ],
                },
            },
            filterApplied: query.filter ?? time_enum_1.TimeFilter.ALL,
            dateRange: { startDate, endDate },
            message: "Home data fetched successfully",
            timestamp: new Date(),
        };
    }
    // ✅ SALES DASHBOARD
    getSellsData(adminId, query) {
        const { startDate, endDate } = this.buildDateRange(query);
        return {
            filterApplied: query.filter ?? time_enum_1.TimeFilter.ALL,
            dateRange: { startDate, endDate },
            sellsData: {
                sellsInLiters: {
                    petrol: { liters: 1200, amount: 96000 },
                    diesel: { liters: 800, amount: 64000 },
                },
                collection: {
                    totalCollected: 160000,
                    paymentModes: {
                        cash: 60000,
                        upi: 40000,
                        card: 30000,
                        credit: 30000,
                    },
                },
                bankDeposit: {
                    depositedAmount: 150000,
                    depositDate: "2026-02-26T15:30:00Z",
                    bankName: "State Bank of India",
                },
                difference: {
                    expected: 160000,
                    deposited: 150000,
                    variance: 10000,
                },
                summary: {
                    totalLiters: 2000,
                    totalSellsAmount: 160000,
                    collectionAmount: 160000,
                    netDeposited: 150000,
                    pendingAmount: 10000,
                },
            },
            message: "Sells data fetched successfully",
            timestamp: new Date(),
        };
    }
    // 🔥 Common Date Range Builder (Daily, Weekly, Monthly, All)
    buildDateRange(query) {
        const now = new Date();
        // ✅ DAILY
        if (query.filter === time_enum_1.TimeFilter.DAILY && query.date) {
            const start = new Date(query.date);
            const end = new Date(query.date);
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
        }
        // ✅ WEEKLY (Default + Optional Override)
        if (query.filter === time_enum_1.TimeFilter.WEEKLY) {
            // agar weekly me bhi custom range diya hai
            if (query.startDate && query.endDate) {
                const start = new Date(query.startDate);
                const end = new Date(query.endDate);
                end.setHours(23, 59, 59, 999);
                if (start > end) {
                    throw new Error("startDate cannot be greater than endDate");
                }
                return { startDate: start, endDate: end };
            }
            // default last 7 days
            const start = new Date();
            start.setDate(now.getDate() - 7);
            return { startDate: start, endDate: now };
        }
        // ✅ MONTHLY
        if (query.filter === time_enum_1.TimeFilter.MONTHLY && query.month) {
            const [year, month] = query.month.split("-");
            const start = new Date(Number(year), Number(month) - 1, 1);
            const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
            return { startDate: start, endDate: end };
        }
        // ✅ CUSTOM (Unlimited Date Range)
        if (query.filter === time_enum_1.TimeFilter.CUSTOM) {
            if (!query.startDate || !query.endDate) {
                throw new Error("startDate and endDate are required for custom filter");
            }
            const start = new Date(query.startDate);
            const end = new Date(query.endDate);
            end.setHours(23, 59, 59, 999);
            if (start > end) {
                throw new Error("startDate cannot be greater than endDate");
            }
            if (end > now) {
                throw new Error("endDate cannot be in the future");
            }
            return { startDate: start, endDate: end };
        }
        // ✅ ALL
        return {
            startDate: new Date(0),
            endDate: now,
        };
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)()
], HomeService);
