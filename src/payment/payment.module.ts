import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UpiController } from "./payment.controller";
import { UpiService } from "./payment.service";
import { UpiPayment, UpiPaymentSchema } from "./payment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UpiPayment.name, schema: UpiPaymentSchema },
    ]),
  ],
  controllers: [UpiController],
  providers: [UpiService],
  exports: [UpiService],
})
export class PaymentModule {}
