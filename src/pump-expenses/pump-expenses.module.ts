import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PumpExpense, PumpExpenseSchema } from "./pump-expenses.schema";
import { PumpExpenseController } from "./pump-expenses.controller";
import { PumpExpenseService } from "./pump-expenses.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PumpExpense.name, schema: PumpExpenseSchema },
    ]),
  ],
  controllers: [PumpExpenseController],
  providers: [PumpExpenseService],
  exports: [PumpExpenseService, MongooseModule],
})
export class PumpExpenseModule {}
