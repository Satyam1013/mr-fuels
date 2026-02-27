import { Injectable } from "@nestjs/common";
import { TimeFilter } from "./home.dto";

@Injectable()
export class HomeService {
  getHomeData(adminId: string, filter?: TimeFilter) {
    const { startDate, endDate } = this.getDateRange(filter);

    return {
      homeData: {
        performance: [
          {
            type: "sales",
            totalSales: 150000,
            salesTarget: 200000,
            lastSales: "99.5%",
            desc: "This shows performance of sales",
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

      filterApplied: filter ?? "all",

      dateRange: {
        startDate,
        endDate,
      },

      message: "Home data fetched successfully",
      timestamp: new Date(),
    };
  }

  getSalesData(adminId: string) {
    // 🔥 Abhi demo/static data return kar rahe hain

    return {
      salesData: {
        date: "2026-02-26",
        salesInLiters: {
          petrol: {
            liters: 1200,
            amount: 96000,
          },
          diesel: {
            liters: 800,
            amount: 64000,
          },
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
          totalSalesAmount: 160000,
          collectionAmount: 160000,
          netDeposited: 150000,
          pendingAmount: 10000,
        },
      },
      message: "Sales data fetched successfully",
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
