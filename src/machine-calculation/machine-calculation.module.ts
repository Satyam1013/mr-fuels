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
  NonFuelProducts,
  NonFuelProductsSchema,
} from "../non-fuel-product/non-fuel-product.schema";
import { Creditor, CreditorSchema } from "../creditors/creditors.schema";
import {
  PersonalExpense,
  PersonalExpenseSchema,
} from "../personal-expense/personal-expense.schema";
import {
  FuelProductDetails,
  FuelProductDetailsSchema,
} from "../fuel-product/fuel-product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MachineCalculation.name, schema: MachineCalculationSchema },
      { name: PumpExpense.name, schema: PumpExpenseSchema },
      { name: PersonalExpense.name, schema: PersonalExpenseSchema },
      { name: Prepaid.name, schema: PrepaidSchema },
      { name: NonFuelProducts.name, schema: NonFuelProductsSchema },
      { name: Creditor.name, schema: CreditorSchema },
      { name: FuelProductDetails.name, schema: FuelProductDetailsSchema },
    ]),
  ],
  controllers: [MachineCalculationController],
  providers: [MachineCalculationService],
})
export class MachineCalculationModule {}
