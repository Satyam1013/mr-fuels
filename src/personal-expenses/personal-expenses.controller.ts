import { Controller } from "@nestjs/common";
import { PersonalExpenseService } from "./personal-expenses.service";

@Controller("personal-expense")
export class PersonalExpenseController {
  constructor(
    private readonly personalExpenseService: PersonalExpenseService,
  ) {}
}
