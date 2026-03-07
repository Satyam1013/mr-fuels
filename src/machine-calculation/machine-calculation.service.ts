import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MachineCalculation } from "./machine-calculation.schema";
import { PumpExpense } from "../pump-expense/pump-expense.schema";
import { Prepaid } from "../prepaid/prepaid.schema";
import { NonFuelProduct } from "../non-fuel-product/non-fuel-product.schema";
import { Creditor } from "../creditors/creditors.schema";
import { CreateMachineCalculationDto } from "./machine-calculation.dto";

@Injectable()
export class MachineCalculationService {
  constructor(
    @InjectModel(MachineCalculation.name)
    private machineCalcModel: Model<MachineCalculation>,

    @InjectModel(PumpExpense.name)
    private pumpExpenseModel: Model<PumpExpense>,

    @InjectModel(Prepaid.name)
    private prepaidModel: Model<Prepaid>,

    @InjectModel(NonFuelProduct.name)
    private nonFuelModel: Model<NonFuelProduct>,

    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,
  ) {}

  async create(adminId: string, dto: CreateMachineCalculationDto) {
    const nozzles = [];

    for (const nozzle of dto.nozzles) {
      // creditor transactions
      const creditData = await this.creditorModel.find({
        machineId: dto.machineId,
        nozzleNumber: nozzle.nozzleNumber,
        shiftNumber: dto.shiftNumber,
        date: dto.date,
      });
      console.log("🚀 ~ create ~ creditData:", creditData);

      // pump expense
      const pumpExpenseData = await this.pumpExpenseModel.find({
        adminId,
        machineId: dto.machineId,
        nozzleNumber: nozzle.nozzleNumber,
        shiftNumber: dto.shiftNumber,
        date: dto.date,
      });

      // prepaid
      const prepaidData = await this.prepaidModel.find({
        adminId,
        machineId: dto.machineId,
        nozzleNumber: nozzle.nozzleNumber,
        shiftNumber: dto.shiftNumber,
        date: dto.date,
      });

      // lubricant / non fuel
      const nonFuelData = await this.nonFuelModel.find({
        adminId,
        machineId: dto.machineId,
        nozzleNumber: nozzle.nozzleNumber,
        shiftNumber: dto.shiftNumber,
        date: dto.date,
      });

      // totals
      const creditTotal = creditData.reduce((s, c) => s + c.amount, 0);

      const pumpExpenseTotal = pumpExpenseData.reduce(
        (s, c) => s + c.amount,
        0,
      );

      const prepaidTotal = prepaidData.reduce((s, c) => s + c.amount, 0);

      const lubricantTotal = nonFuelData.reduce((s, c) => s + c.amount, 0);

      const expenseTotal = pumpExpenseTotal;

      const finalAmount =
        nozzle.fuelSaleAmount +
        lubricantTotal +
        prepaidTotal -
        creditTotal -
        expenseTotal;

      nozzles.push({
        ...nozzle,
        creditTotal,
        expenseTotal,
        prepaidTotal,
        lubricantTotal,
        finalAmount,
      });
    }

    const calculation = new this.machineCalcModel({
      adminId,
      machineId: new Types.ObjectId(dto.machineId),
      date: dto.date,
      shiftNumber: dto.shiftNumber,
      nozzles,
    });

    return calculation.save();
  }

  async getAll(adminId: string) {
    return this.machineCalcModel
      .find({ adminId })
      .populate("machineId")
      .populate("nozzles.staffId");
  }

  async getById(id: string) {
    return this.machineCalcModel.findById(id);
  }

  async remove(id: string) {
    return this.machineCalcModel.findByIdAndDelete(id);
  }
}
