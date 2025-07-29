import { Module, forwardRef } from "@nestjs/common";
import { CreditorContactController } from "./creditor-contact.controller";
import { CreditorContactService } from "./creditor-contact.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CreditorContact,
  CreditorContactSchema,
} from "./creditor-contact.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditorContact.name, schema: CreditorContactSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CreditorContactController],
  providers: [CreditorContactService],
  exports: [MongooseModule],
})
export class CreditorContactModule {}
