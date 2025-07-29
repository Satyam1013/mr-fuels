import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CreditorContactController } from "./creditor-contact.controller";
import { CreditorContactService } from "./creditor-contact.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CreditorContact,
  CreditorContactSchema,
} from "./creditor-contact.schema";
import { AuthGuard } from "../auth/auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditorContact.name, schema: CreditorContactSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [CreditorContactController],
  providers: [CreditorContactService, AuthGuard],
  exports: [MongooseModule],
})
export class CreditorContactModule {}
