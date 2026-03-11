import { Injectable } from "@nestjs/common";
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

  async create(adminId: string, dto: CreateMachineCalculationDto) {
    const nozzles = [];

    const startDate = new Date(dto.date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dto.date);
    endDate.setHours(23, 59, 59, 999);

    for (const nozzle of dto.nozzles) {
      const nozzleNumber = parseInt(nozzle.nozzleName.replace(/\D/g, "")) || 1;

      nozzles.push({
        nozzleNumber,

        lastReading: nozzle.lastReading,
        currentReading: nozzle.currentReading,
        testingLiters: nozzle.testingLiters,
        faultTestingLiters: nozzle.faultTestingLiters,
        pricePerLiter: nozzle.pricePerLiter,
        upiAmount: nozzle.upiAmount,
        posAmount: nozzle.posAmount,

        staffId: new Types.ObjectId(nozzle.staffId),
      });
    }

    const calculation = new this.machineCalcModel({
      adminId: new Types.ObjectId(adminId),
      machineId: new Types.ObjectId(dto.machineId),
      date: new Date(dto.date),
      shiftNumber: dto.shiftNumber,
      nozzles,
    });

    return calculation.save();
  }

  async getAll(adminId: string) {
    return this.machineCalcModel
      .find({ adminId: new Types.ObjectId(adminId) })
      .populate("machineId")
      .populate("nozzles.staffId")
      .populate("nozzles.creditIds")
      .populate("nozzles.pumpExpenseIds")
      .populate("nozzles.personalExpenseIds")
      .populate("nozzles.prepaidIds")
      .populate("nozzles.nonFuelProductIds")
      .sort({ date: -1 });
  }

  async getMachineDetails(
    adminId: string,
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
      baseQuery.shiftNumber = shiftNumber;
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
        .lean(),

      this.creditorModel.find(baseQuery),

      this.pumpExpenseModel.find(baseQuery),

      this.personalExpenseModel.find(baseQuery),

      this.prepaidModel.find(baseQuery),

      this.nonFuelModel.find(baseQuery),
    ]);

    let filteredMachineData = machineCalcData;

    if (nozzleNumber) {
      filteredMachineData = machineCalcData.map((item) => ({
        ...item,
        nozzles: item.nozzles.filter(
          (n) =>
            (parseInt(n.nozzleName.replace(/\D/g, "")) || 1) ===
            Number(nozzleNumber),
        ),
      }));
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
