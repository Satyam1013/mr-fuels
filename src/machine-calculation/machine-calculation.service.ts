import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MachineCalculation } from "./machine-calculation.schema";
import { PumpExpense } from "../pump-expense/pump-expense.schema";
import { Prepaid } from "../prepaid/prepaid.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";
import { Creditor } from "../creditors/creditors.schema";
import {
  CreateMachineCalculationDto,
  UpdateMachineCalculationDto,
} from "./machine-calculation.dto";
import { PersonalExpense } from "../personal-expense/personal-expense.schema";
import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";

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

    @InjectModel(FuelProductDetails.name)
    private fuelProductDetailsModel: Model<FuelProductDetails>,
  ) {}

  private async getFuelProductDetails(adminId: Types.ObjectId) {
    return this.fuelProductDetailsModel.findOne({ adminId }).lean();
  }

  async create(adminId: Types.ObjectId, dto: CreateMachineCalculationDto) {
    const nozzles = dto.nozzles.map((nozzle) => {
      // Is nozzle ka staff dhundo
      const assignedStaff = dto.staff.find((s) =>
        s.assignedNozzleNumbers.includes(nozzle.nozzleNumber),
      );

      return {
        nozzleName: nozzle.nozzleName,
        nozzleNumber: nozzle.nozzleNumber,
        fuelProductId: new Types.ObjectId(nozzle.fuelProductId),
        lastReading: nozzle.lastReading,
        currentReading: nozzle.currentReading,
        testingLiters: nozzle.testingLiters,
        faultTestingLiters: nozzle.faultTestingLiters,
        upiAmount: assignedStaff?.upiAmount || 0,
        posAmount: assignedStaff?.posAmount || 0,
        staffId: assignedStaff
          ? new Types.ObjectId(assignedStaff.staffId)
          : undefined,
      };
    });

    const calculation = new this.machineCalcModel({
      adminId,
      machineId: new Types.ObjectId(dto.machineId),
      date: new Date(dto.date),
      shiftNumber: dto.shiftNumber,
      nozzles,
      staff: dto.staff.map((s) => ({
        staffId: new Types.ObjectId(s.staffId),
        assignedNozzleNumbers: s.assignedNozzleNumbers,
        upiAmount: s.upiAmount,
        posAmount: s.posAmount,
      })),
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
      fuelProductDetails,
    ] = await Promise.all([
      this.machineCalcModel
        .find({ adminId })
        .populate("machineId")
        .populate("nozzles.staffId")
        .sort({ date: -1 })
        .lean(),

      this.creditorModel.find({ adminId }).lean(),
      this.pumpExpenseModel.find({ adminId }).lean(),
      this.personalExpenseModel.find({ adminId }).lean(),
      this.prepaidModel.find({ adminId }).lean(),
      this.nonFuelModel.find({ adminId }).lean(),
      this.getFuelProductDetails(adminId),
    ]);

    return machineCalcs.map((calc) => ({
      ...calc,
      nozzles: calc.nozzles.map((nozzle) => {
        const product = fuelProductDetails?.products.find(
          (p) => p._id.toString() === nozzle.fuelProductId.toString(),
        );
        return {
          ...nozzle,
          fuelType: product?.fuelType,
          pricePerLiter: product?.price || 0,
        };
      }),
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
    const objectMachineId = new Types.ObjectId(machineId);

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const baseQuery: Record<string, any> = {
      adminId,
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
      fuelProductDetails,
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
      this.getFuelProductDetails(adminId),
    ]);

    // Nozzles me price attach karo
    const machineCalcWithPrice = machineCalcData.map((item) => ({
      ...item,
      nozzles: item.nozzles.map((nozzle) => {
        const product = fuelProductDetails?.products.find(
          (p) =>
            (p as FuelProductDetail)._id.toString() ===
            nozzle.fuelProductId.toString(),
        );
        return {
          ...nozzle,
          fuelType: product?.fuelType,
          pricePerLiter: product?.price || 0,
        };
      }),
    }));

    let previousEntry = null;

    if (shiftNumber) {
      previousEntry = await this.machineCalcModel
        .findOne({
          adminId,
          machineId: objectMachineId,
          $or: [
            {
              date: { $gte: startDate, $lte: endDate },
              shiftNumber: { $lt: Number(shiftNumber) },
            },
            { date: { $lt: startDate } },
          ],
        })
        .sort({ date: -1, shiftNumber: -1 })
        .lean();
    } else {
      previousEntry = await this.machineCalcModel
        .findOne({
          adminId,
          machineId: objectMachineId,
          date: { $lt: startDate },
        })
        .sort({ date: -1, shiftNumber: -1 })
        .lean();
    }

    let filteredMachineData = machineCalcWithPrice;

    if (nozzleNumber) {
      filteredMachineData = machineCalcWithPrice.map((item) => ({
        ...item,
        nozzles: item.nozzles.filter(
          (n) => n.nozzleNumber === Number(nozzleNumber),
        ),
      }));
    }

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
        return { ...item, nozzles: updatedNozzles };
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

  async update(
    adminId: Types.ObjectId,
    id: string,
    dto: UpdateMachineCalculationDto,
  ) {
    const existing = await this.machineCalcModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new NotFoundException(`Machine calculation ${id} not found.`);
    }

    if (dto.nozzles) {
      existing.nozzles = dto.nozzles.map((nozzle) => {
        const assignedStaff = (dto.staff ?? existing.staff)?.find((s) =>
          s.assignedNozzleNumbers.includes(nozzle.nozzleNumber),
        );

        return {
          nozzleName: nozzle.nozzleName,
          nozzleNumber: nozzle.nozzleNumber,
          fuelProductId: new Types.ObjectId(nozzle.fuelProductId),
          lastReading: nozzle.lastReading,
          currentReading: nozzle.currentReading,
          testingLiters: nozzle.testingLiters,
          faultTestingLiters: nozzle.faultTestingLiters,
          changeReading: nozzle.changeReading ?? 0, // ✅
          isPriceChanged: nozzle.isPriceChanged ?? false, // ✅
          upiAmount: assignedStaff?.upiAmount || 0,
          posAmount: assignedStaff?.posAmount || 0,
          staffId: assignedStaff
            ? new Types.ObjectId(assignedStaff.staffId)
            : undefined,
        };
      });
    }

    // Staff update karo agar bheje hain
    if (dto.staff) {
      existing.staff = dto.staff.map((s) => ({
        staffId: new Types.ObjectId(s.staffId),
        assignedNozzleNumbers: s.assignedNozzleNumbers,
        upiAmount: s.upiAmount,
        posAmount: s.posAmount,
      }));
    }

    // Baaki fields update karo
    if (dto.date) existing.date = new Date(dto.date);
    if (dto.shiftNumber) existing.shiftNumber = dto.shiftNumber;
    if (dto.machineId) existing.machineId = new Types.ObjectId(dto.machineId);

    return existing.save();
  }

  async remove(id: string) {
    return this.machineCalcModel.findByIdAndDelete(id);
  }
}
