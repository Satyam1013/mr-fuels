import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SalesController } from "./sales.controller";
import { SalesService } from "./sales.service";
import { Sales, SalesSchema } from "./sales.schema";
import { Admin, AdminSchema } from "../admin/admin.schema";
import { Machine, MachineSchema } from "../machines/machines.schema";
import {
  TransactionDetails,
  TransactionDetailsSchema,
} from "../transactions/transactions.schema";
import { Staff, StaffSchema } from "../staff/staff.schema";
import {
  PumpDetails,
  PumpDetailsSchema,
} from "../pump-details/pump-details.schema";
import {
  NonFuelProducts,
  NonFuelProductsSchema,
} from "../non-fuel-product/non-fuel-product.schema";
import {
  MachineCalculation,
  MachineCalculationSchema,
} from "../machine-calculation/machine-calculation.schema";
import { Creditor, CreditorSchema } from "../creditors/creditors.schema";
import { Prepaid, PrepaidSchema } from "../prepaid/prepaid.schema";
import {
  NonFuelSellProduct,
  NonFuelSellProductSchema,
} from "../non-fuel-product-sales/non-fuel-product-sales.schema";
import {
  DigitalPayment,
  DigitalPaymentSchema,
} from "../digital-payment/digital-payment.schema";
import {
  PumpExpense,
  PumpExpenseSchema,
} from "../pump-expense/pump-expense.schema";
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
      { name: Sales.name, schema: SalesSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Machine.name, schema: MachineSchema },
      { name: TransactionDetails.name, schema: TransactionDetailsSchema },
      { name: NonFuelProducts.name, schema: NonFuelProductsSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: PumpDetails.name, schema: PumpDetailsSchema },
      { name: MachineCalculation.name, schema: MachineCalculationSchema },
      { name: Creditor.name, schema: CreditorSchema },
      { name: Prepaid.name, schema: PrepaidSchema },
      { name: NonFuelSellProduct.name, schema: NonFuelSellProductSchema },
      { name: DigitalPayment.name, schema: DigitalPaymentSchema },
      { name: PumpExpense.name, schema: PumpExpenseSchema },
      { name: PersonalExpense.name, schema: PersonalExpenseSchema },
      { name: FuelProductDetails.name, schema: FuelProductDetailsSchema },
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
