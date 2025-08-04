import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  PersonalExpense,
  PersonalExpenseSchema,
} from "./personal-expenses.schema";
import { PersonalExpenseController } from "./personal-expenses.controller";
import { PersonalExpenseService } from "./personal-expenses.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PersonalExpense.name, schema: PersonalExpenseSchema },
    ]),
  ],
  controllers: [PersonalExpenseController],
  providers: [PersonalExpenseService],
  exports: [PersonalExpenseService, MongooseModule],
})
export class PersonalExpenseModule {}
