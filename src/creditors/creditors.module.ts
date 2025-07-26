import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Creditor, CreditorSchema } from "./creditors.schema";
import { CreditorController } from "./creditors.controller";
import { CreditorService } from "./creditors.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Creditor.name, schema: CreditorSchema },
    ]),
  ],
  controllers: [CreditorController],
  providers: [CreditorService],
})
export class CreditorModule {}
