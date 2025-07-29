import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PumpExpense, PumpExpenseSchema } from "./pump-expenses.schema";
import { PumpExpenseController } from "./pump-expenses.controller";
import { PumpExpenseService } from "./pump-expenses.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PumpExpense.name, schema: PumpExpenseSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PumpExpenseController],
  providers: [PumpExpenseService],
  exports: [PumpExpenseService, MongooseModule],
})
export class PumpExpenseModule {}
