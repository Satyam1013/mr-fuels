import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("create-user")
  createUser(@Body() userData: any) {
    return this.adminService.createUser(userData);
  }

  @Patch("update-user/:id")
  updateUser(@Param("id") id: string, @Body() userData: any) {
    return this.adminService.updateUser(id, userData);
  }

  @Delete("delete-user/:id")
  deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }
}
