import { PumpDataService } from "./pump-data.service";
import { PumpDataType } from "./pump-data.dto";
export declare class PumpDataController {
    private readonly pumpDataService;
    constructor(pumpDataService: PumpDataService);
    getPumpData(date: string, type: PumpDataType): Promise<{
        sellAmount: number;
        amountCollected: number;
        amountToCollect: number;
        amountDeposit: number;
        moneyGeneratedByMachine: {
            machineNo: string;
            nozzleNo: string;
            fuelType: string;
            amount: number;
        }[];
        totalMoneyGenerated: number;
        testingExpenses: never[];
        totalTestingExpenses: number;
        pumpExpenses: never[];
        totalPumpExpenses: number;
        personalExpenses: never[];
        totalPersonalExpenses: number;
        creditorsAndLenders: never[];
        totalCreditorsLenders: number;
        digitalPayments: {
            phonePe: number;
            cardSwipe: number;
            total: number;
        };
        moneyCollected: never[];
        totalMoneyCollected: number;
    }>;
}
