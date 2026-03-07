import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DigitalPaymentController } from "./digital-payment.controller";
import { DigitalPaymentService } from "./digital-payment.service";
import { DigitalPayment, DigitalPaymentSchema } from "./digital-payment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DigitalPayment.name, schema: DigitalPaymentSchema },
    ]),
  ],
  controllers: [DigitalPaymentController],
  providers: [DigitalPaymentService],
})
export class DigitalPaymentModule {}
