import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionDetailsController } from "./transactions.controller";
import { TransactionDetailsService } from "./transactions.service";
import {
  TransactionDetails,
  TransactionDetailsSchema,
} from "./transactions.schema";
import { Admin, AdminSchema } from "../admin/admin.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TransactionDetails.name,
        schema: TransactionDetailsSchema,
      },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [TransactionDetailsController],
  providers: [TransactionDetailsService],
})
export class TransactionDetailsModule {}
