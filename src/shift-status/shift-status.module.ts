import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShiftStatus, ShiftStatusSchema } from "./shift-status.schema";
import { ShiftStatusService } from "./shift-status.service";
import { ShiftStatusController } from "./shift-status.controller";
import {
  PumpDetails,
  PumpDetailsSchema,
} from "../pump-details/pump-details.schema";
import { Admin, AdminSchema } from "../admin/admin.schema";
import { Manager, ManagerSchema } from "../managers/managers.schema";
import { Sales, SalesSchema } from "../sales/sales.schema";
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
import { Staff, StaffSchema } from "../staff/staff.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShiftStatus.name, schema: ShiftStatusSchema },
      { name: PumpDetails.name, schema: PumpDetailsSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Manager.name, schema: ManagerSchema },
      { name: Sales.name, schema: SalesSchema },
      { name: MachineCalculation.name, schema: MachineCalculationSchema },
      { name: Creditor.name, schema: CreditorSchema },
      { name: Prepaid.name, schema: PrepaidSchema },
      { name: NonFuelSellProduct.name, schema: NonFuelSellProductSchema },
      { name: DigitalPayment.name, schema: DigitalPaymentSchema },
      { name: PumpExpense.name, schema: PumpExpenseSchema },
      { name: PersonalExpense.name, schema: PersonalExpenseSchema },
      { name: FuelProductDetails.name, schema: FuelProductDetailsSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
  ],
  controllers: [ShiftStatusController],
  providers: [ShiftStatusService],
})
export class ShiftStatusModule {}
