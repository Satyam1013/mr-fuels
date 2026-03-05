import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PumpExpenseController } from "./pump-expense.controller";
import { PumpExpenseService } from "./pump-expense.service";
import { PumpExpense, PumpExpenseSchema } from "./pump-expense.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PumpExpense.name, schema: PumpExpenseSchema },
    ]),
  ],
  controllers: [PumpExpenseController],
  providers: [PumpExpenseService],
})
export class PumpExpenseModule {}
