import { Module } from "@nestjs/common";
import { CreditorContactController } from "./creditor-contact.controller";
import { CreditorContactService } from "./creditor-contact.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CreditorContact,
  CreditorContactSchema,
} from "./creditor-contact.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditorContact.name, schema: CreditorContactSchema },
    ]),
  ],
  controllers: [CreditorContactController],
  providers: [CreditorContactService],
  exports: [MongooseModule],
})
export class CreditorContactModule {}
