/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Machine, MachineDocument } from "../machine/machine.schema";
import { FuelPrice, FuelPriceDocument } from "../fuel-price/fuel-price.schema";
import { PumpDataType } from "./pump-data.dto";

@Injectable()
export class PumpDataService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<MachineDocument>,
    @InjectModel(FuelPrice.name)
    private fuelPriceModel: Model<FuelPriceDocument>,
  ) {}

  async getPumpData(date: string, type: PumpDataType) {
    const targetDate = new Date(date);
    const start = new Date(targetDate);
    const end = new Date(targetDate);

    if (type === PumpDataType.DAILY) {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (type === PumpDataType.MONTHLY) {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    }

    const fuelPrices = await this.fuelPriceModel
      .findOne()
      .sort({ createdAt: -1 });

    const machines = await this.machineModel.find();

    const moneyGeneratedByMachine: {
      machineNo: string;
      nozzleNo: string;
      fuelType: string;
      amount: number;
    }[] = [];
    let totalMoneyGenerated = 0;

    for (const machine of machines) {
      const readings = machine.readings
        .filter((r) => r.date >= start && r.date <= end)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      if (readings.length >= 2) {
        const litersDispensed =
          readings[readings.length - 1].reading - readings[0].reading;
        const rate = fuelPrices
          ? fuelPrices[machine.fuelType.toLowerCase()] || 0
          : 0;
        const amount = litersDispensed * rate;

        moneyGeneratedByMachine.push({
          machineNo: machine.machineNo,
          nozzleNo: machine.nozzleNo,
          fuelType: machine.fuelType,
          amount,
        });

        totalMoneyGenerated += amount;
      }
    }

    return {
      sellAmount: totalMoneyGenerated,
      amountCollected: 0,
      amountToCollect: totalMoneyGenerated,
      amountDeposit: 0,

      moneyGeneratedByMachine,
      totalMoneyGenerated,

      testingExpenses: [],
      totalTestingExpenses: 0,

      pumpExpenses: [],
      totalPumpExpenses: 0,

      personalExpenses: [],
      totalPersonalExpenses: 0,

      creditorsAndLenders: [],
      totalCreditorsLenders: 0,

      digitalPayments: {
        phonePe: 0,
        cardSwipe: 0,
        total: 0,
      },

      moneyCollected: [],
      totalMoneyCollected: 0,
    };
  }
}
