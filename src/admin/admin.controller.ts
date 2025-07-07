import { Controller, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
