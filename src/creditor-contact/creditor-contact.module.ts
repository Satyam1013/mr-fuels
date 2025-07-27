import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CreditorContact,
  CreditorContactSchema,
} from "./creditor-contact.schema";
import { CreditorContactService } from "./creditor-contact.service";
import { CreditorContactController } from "./creditor-contact.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditorContact.name, schema: CreditorContactSchema },
    ]),
  ],
  controllers: [CreditorContactController],
  providers: [CreditorContactService],
})
export class CreditorContactModule {}
