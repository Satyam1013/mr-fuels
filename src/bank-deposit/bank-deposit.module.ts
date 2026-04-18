import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BankDepositController } from "./bank-deposit.controller";
import { BankDepositService } from "./bank-deposit.service";
import { BankDeposit, BankDepositSchema } from "./bank-deposit.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankDeposit.name, schema: BankDepositSchema },
    ]),
  ],
  controllers: [BankDepositController],
  providers: [BankDepositService],
  exports: [BankDepositService],
})
export class BankDepositModule {}
