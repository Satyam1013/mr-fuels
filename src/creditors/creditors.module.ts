import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Creditor, CreditorSchema } from "./creditors.schema";
import { CreditorController } from "./creditors.controller";
import { CreditorService } from "./creditors.service";
import { CreditorContactModule } from "../creditor-contact/creditor-contact.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Creditor.name, schema: CreditorSchema },
    ]),
    forwardRef(() => CreditorContactModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [CreditorController],
  providers: [CreditorService],
  exports: [MongooseModule],
})
export class CreditorModule {}
