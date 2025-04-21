import { Model } from "mongoose";
import { MachineDocument } from "../machine/machine.schema";
import { FuelPriceDocument } from "../fuel-price/fuel-price.schema";
import { PumpDataType } from "./pump-data.dto";
export declare class PumpDataService {
    private machineModel;
    private fuelPriceModel;
    constructor(machineModel: Model<MachineDocument>, fuelPriceModel: Model<FuelPriceDocument>);
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
