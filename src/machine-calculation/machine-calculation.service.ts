import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MachineCalculation } from "./machine-calculation.schema";
import { PumpExpense } from "../pump-expense/pump-expense.schema";
import { Prepaid } from "../prepaid/prepaid.schema";
import { NonFuelProduct } from "../non-fuel-product/non-fuel-product.schema";
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

    @InjectModel(NonFuelProduct.name)
    private nonFuelModel: Model<NonFuelProduct>,

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

      const [
        creditData,
        pumpExpenseData,
        personalExpenseData,
        prepaidData,
        nonFuelData,
      ] = await Promise.all([
        this.creditorModel.find({
          machineId: new Types.ObjectId(dto.machineId),
          nozzleNumber,
          shiftNumber: dto.shiftNumber,
          date: { $gte: startDate, $lte: endDate },
        }),

        this.pumpExpenseModel.find({
          machineId: new Types.ObjectId(dto.machineId),
          nozzleNumber,
          shiftNumber: dto.shiftNumber,
          date: { $gte: startDate, $lte: endDate },
        }),

        this.personalExpenseModel.find({
          machineId: new Types.ObjectId(dto.machineId),
          nozzleNumber,
          shiftNumber: dto.shiftNumber,
          date: { $gte: startDate, $lte: endDate },
        }),

        this.prepaidModel.find({
          machineId: new Types.ObjectId(dto.machineId),
          nozzleNumber,
          shiftNumber: dto.shiftNumber,
          date: { $gte: startDate, $lte: endDate },
        }),

        this.nonFuelModel.find({
          machineId: new Types.ObjectId(dto.machineId),
          nozzleNumber,
          shiftNumber: dto.shiftNumber,
          date: { $gte: startDate, $lte: endDate },
        }),
      ]);

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

        creditIds: creditData.map((c) => c._id),

        pumpExpenseIds: pumpExpenseData.map((e) => e._id),

        personalExpenseIds: personalExpenseData.map((e) => e._id),

        prepaidIds: prepaidData.map((p) => p._id),

        nonFuelProductIds: nonFuelData.map((n) => n._id),
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
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const query: Record<string, any> = {
      adminId: new Types.ObjectId(adminId),
      machineId: new Types.ObjectId(machineId),
      date: { $gte: startDate, $lte: endDate },
    };

    if (shiftNumber) {
      query.shiftNumber = shiftNumber;
    }

    const data = await this.machineCalcModel
      .find(query)
      .populate("machineId")
      .populate("nozzles.staffId")
      .populate("nozzles.creditIds")
      .populate("nozzles.pumpExpenseIds")
      .populate("nozzles.personalExpenseIds")
      .populate("nozzles.prepaidIds")
      .populate("nozzles.nonFuelProductIds");

    if (!nozzleNumber) return data;

    // nozzle filter
    return data.map((item) => ({
      ...item.toObject(),
      nozzles: item.nozzles.filter(
        (n) =>
          (parseInt(n.nozzleName.replace(/\D/g, "")) || 1) ===
          Number(nozzleNumber),
      ),
    }));
  }

  async getById(id: string) {
    return this.machineCalcModel.findById(id);
  }

  async remove(id: string) {
    return this.machineCalcModel.findByIdAndDelete(id);
  }
}
