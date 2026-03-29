import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MachineCalculation } from "./machine-calculation.schema";
import { PumpExpense } from "../pump-expense/pump-expense.schema";
import { Prepaid } from "../prepaid/prepaid.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";
import { Creditor } from "../creditors/creditors.schema";
import { CreateMachineCalculationDto } from "./machine-calculation.dto";
import { PersonalExpense } from "../personal-expense/personal-expense.schema";

@Injectable()
export class MachineCalculationService {
  constructor(
    @InjectModel(MachineCalculation.name)
    private machineCalcModel: Model<MachineCalculation>,

    @InjectModel(PumpExpense.name)
    private pumpExpenseModel: Model<PumpExpense>,

    @InjectModel(PersonalExpense.name)
    private personalExpenseModel: Model<PersonalExpense>,

    @InjectModel(Prepaid.name)
    private prepaidModel: Model<Prepaid>,

    @InjectModel(NonFuelProducts.name)
    private nonFuelModel: Model<NonFuelProducts>,

    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateMachineCalculationDto) {
    const nozzles = dto.nozzles.map((nozzle) => ({
      nozzleName: nozzle.nozzleName,
      nozzleNumber: nozzle.nozzleNumber,
      fuelProductId: new Types.ObjectId(nozzle.fuelProductId),
      lastReading: nozzle.lastReading,
      currentReading: nozzle.currentReading,
      testingLiters: nozzle.testingLiters,
      faultTestingLiters: nozzle.faultTestingLiters,
      upiAmount: nozzle.upiAmount,
      posAmount: nozzle.posAmount,
      staffId: new Types.ObjectId(nozzle.staffId),
    }));

    const calculation = new this.machineCalcModel({
      adminId,
      machineId: new Types.ObjectId(dto.machineId),
      date: new Date(dto.date),
      shiftNumber: dto.shiftNumber,
      nozzles,
    });

    return calculation.save();
  }

  async getNozzleDetails(adminId: Types.ObjectId, machineId: string) {
    const calculation = await this.machineCalcModel
      .findOne({
        adminId: new Types.ObjectId(adminId),
        machineId: new Types.ObjectId(machineId),
      })
      .sort({ date: -1, shiftNumber: -1 })
      .lean();

    if (!calculation) {
      throw new NotFoundException("No machine calculation found");
    }

    return calculation.nozzles;
  }

  async getAll(adminId: Types.ObjectId) {
    const [
      machineCalcs,
      credits,
      pumpExpenses,
      personalExpenses,
      prepaidEntries,
      nonFuelSales,
    ] = await Promise.all([
      this.machineCalcModel
        .find({ adminId })
        .populate("machineId")
        .populate("nozzles.staffId")
        .populate("nozzles.fuelProductId")
        .sort({ date: -1 })
        .lean(),

      this.creditorModel.find({ adminId }).lean(),
      this.pumpExpenseModel.find({ adminId }).lean(),
      this.personalExpenseModel.find({ adminId }).lean(),
      this.prepaidModel.find({ adminId }).lean(),
      this.nonFuelModel.find({ adminId }).lean(),
    ]);

    return machineCalcs.map((calc) => ({
      ...calc,
      credits,
      pumpExpenses,
      personalExpenses,
      prepaidEntries,
      nonFuelSales,
    }));
  }

  async getMachineDetails(
    adminId: Types.ObjectId,
    machineId: string,
    date: string,
    nozzleNumber?: number,
    shiftNumber?: number,
  ) {
    const objectAdminId = new Types.ObjectId(adminId);
    const objectMachineId = new Types.ObjectId(machineId);

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const baseQuery: Record<string, any> = {
      adminId: objectAdminId,
      machineId: objectMachineId,
      date: { $gte: startDate, $lte: endDate },
    };

    if (shiftNumber) {
      baseQuery.shiftNumber = Number(shiftNumber);
    }

    const [
      machineCalcData,
      creditEntries,
      pumpExpenses,
      personalExpenses,
      prepaidEntries,
      nonFuelSales,
    ] = await Promise.all([
      this.machineCalcModel
        .find(baseQuery)
        .populate("machineId")
        .populate("nozzles.staffId")
        .populate("nozzles.fuelProductId")
        .lean(),

      this.creditorModel.find(baseQuery),
      this.pumpExpenseModel.find(baseQuery),
      this.personalExpenseModel.find(baseQuery),
      this.prepaidModel.find(baseQuery),
      this.nonFuelModel.find(baseQuery),
    ]);

    // 🔥 FETCH PREVIOUS ENTRY (important logic)
    let previousEntry = null;

    if (shiftNumber) {
      // Case: Shift provided → check same day previous shift OR previous date
      previousEntry = await this.machineCalcModel
        .findOne({
          adminId: objectAdminId,
          machineId: objectMachineId,
          $or: [
            {
              date: { $gte: startDate, $lte: endDate },
              shiftNumber: { $lt: Number(shiftNumber) },
            },
            {
              date: { $lt: startDate },
            },
          ],
        })
        .sort({ date: -1, shiftNumber: -1 })
        .lean();
    } else {
      // Case: No shift → just previous date
      previousEntry = await this.machineCalcModel
        .findOne({
          adminId: objectAdminId,
          machineId: objectMachineId,
          date: { $lt: startDate },
        })
        .sort({ date: -1, shiftNumber: -1 })
        .lean();
    }

    // 🔥 FILTER NOZZLE (if provided)
    let filteredMachineData = machineCalcData;

    if (nozzleNumber) {
      filteredMachineData = machineCalcData.map((item) => ({
        ...item,
        nozzles: item.nozzles.filter(
          (n) => n.nozzleNumber === Number(nozzleNumber),
        ),
      }));
    }

    // 🔥 APPLY PREVIOUS READING LOGIC
    if (previousEntry) {
      filteredMachineData = filteredMachineData.map((item) => {
        const updatedNozzles = item.nozzles.map((nozzle) => {
          const prevNozzle = previousEntry.nozzles.find(
            (n) => n.nozzleNumber === nozzle.nozzleNumber,
          );

          return {
            ...nozzle,
            lastReading: prevNozzle?.currentReading ?? nozzle.lastReading ?? 0,
          };
        });

        return {
          ...item,
          nozzles: updatedNozzles,
        };
      });
    }

    return {
      machine: filteredMachineData,
      creditors: creditEntries,
      pumpExpenses,
      personalExpenses,
      prepaidEntries,
      nonFuelSales,
    };
  }

  async getById(id: string) {
    return this.machineCalcModel.findById(id);
  }

  async remove(id: string) {
    return this.machineCalcModel.findByIdAndDelete(id);
  }
}
