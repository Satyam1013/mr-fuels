import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PersonalExpenseController } from "./personal-expense.controller";
import { PersonalExpenseService } from "./personal-expense.service";
import {
  PersonalExpense,
  PersonalExpenseSchema,
} from "./personal-expense.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PersonalExpense.name, schema: PersonalExpenseSchema },
    ]),
  ],
  controllers: [PersonalExpenseController],
  providers: [PersonalExpenseService],
})
export class PersonalExpenseModule {}
