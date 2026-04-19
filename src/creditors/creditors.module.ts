import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Creditor, CreditorSchema } from "./creditors.schema";
import { CreditorService } from "./creditors.service";
import { CreditorController } from "./creditors.controller";
import { CustomerModule } from "../customer/customer.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Creditor.name, schema: CreditorSchema },
    ]),
    CustomerModule,
  ],
  controllers: [CreditorController],
  providers: [CreditorService],
})
export class CreditorModule {}
