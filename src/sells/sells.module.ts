import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SellsController } from "./sells.controller";
import { SellsService } from "./sells.service";
import { Sells, SellsSchema } from "./sells.schema";
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
} from "../non-fuel-product-sell/non-fuel-product-sell.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sells.name, schema: SellsSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Machine.name, schema: MachineSchema },
      { name: TransactionDetails.name, schema: TransactionDetailsSchema },
      { name: NonFuelSellProduct.name, schema: NonFuelSellProductSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: PumpDetails.name, schema: PumpDetailsSchema },
    ]),
  ],
  controllers: [SellsController],
  providers: [SellsService],
})
export class SellsModule {}
