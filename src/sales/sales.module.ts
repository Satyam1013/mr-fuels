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
  NonFuelSellProduct,
  NonFuelSellProductSchema,
} from "../non-fuel-product-sales/non-fuel-product-sales.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sales.name, schema: SalesSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Machine.name, schema: MachineSchema },
      { name: TransactionDetails.name, schema: TransactionDetailsSchema },
      { name: NonFuelSellProduct.name, schema: NonFuelSellProductSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: PumpDetails.name, schema: PumpDetailsSchema },
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
