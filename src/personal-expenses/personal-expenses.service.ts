import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  PersonalExpense,
  PersonalExpenseDocument,
} from "./personal-expenses.schema";

@Injectable()
export class PersonalExpenseService {
  constructor(
    @InjectModel(PersonalExpense.name)
    private readonly personalExpenseModel: Model<PersonalExpenseDocument>,
  ) {}
}
