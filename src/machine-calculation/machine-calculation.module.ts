import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  MachineCalculation,
  MachineCalculationSchema,
} from "./machine-calculation.schema";
import { MachineCalculationService } from "./machine-calculation.service";
import { MachineCalculationController } from "./machine-calculation.controller";
import {
  PumpExpense,
  PumpExpenseSchema,
} from "../pump-expense/pump-expense.schema";
import { Prepaid, PrepaidSchema } from "../prepaid/prepaid.schema";
import {
  NonFuelProduct,
  NonFuelProductSchema,
} from "../non-fuel-product/non-fuel-product.schema";
import { Creditor, CreditorSchema } from "../creditors/creditors.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MachineCalculation.name, schema: MachineCalculationSchema },
      { name: PumpExpense.name, schema: PumpExpenseSchema },
      { name: Prepaid.name, schema: PrepaidSchema },
      { name: NonFuelProduct.name, schema: NonFuelProductSchema },
      { name: Creditor.name, schema: CreditorSchema },
    ]),
  ],
  controllers: [MachineCalculationController],
  providers: [MachineCalculationService],
})
export class MachineCalculationModule {}
