import { Injectable } from "@nestjs/common";
import { TimeFilter } from "./home.dto";

@Injectable()
export class HomeService {
  getHomeData(adminId: string, filter?: TimeFilter) {
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
  private getDateRange(filter?: TimeFilter) {
    const now = new Date();
    let startDate: Date;

    if (filter === TimeFilter.WEEK) {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (filter === TimeFilter.MONTH) {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(0); // all time
    }

    return {
      startDate,
      endDate: now,
    };
  }
}
