import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Prepaid, PrepaidSchema } from "./prepaid.schema";
import { PrepaidService } from "./prepaid.service";
import { PrepaidController } from "./prepaid.controller";
import { CustomerModule } from "../customer/customer.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prepaid.name, schema: PrepaidSchema }]),
    CustomerModule,
  ],
  controllers: [PrepaidController],
  providers: [PrepaidService],
})
export class PrepaidModule {}
