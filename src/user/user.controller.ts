import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRole } from "./user.schema";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("manager")
  addManager(@Body() data: any) {
    return this.userService.create({ ...data, role: UserRole.MANAGER });
  }

  @Post("staff")
  addStaff(@Body() data: any) {
    return this.userService.create({ ...data, role: UserRole.STAFF });
  }

  @Patch(":id")
  editUser(@Param("id") id: string, @Body() updates: any) {
    return this.userService.update(id, updates);
  }

  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.userService.delete(id);
  }

  @Get("manager")
  getAllManagers() {
    return this.userService.findAllByRole(UserRole.MANAGER);
  }

  @Get("staff")
  getAllStaff() {
    return this.userService.findAllByRole(UserRole.STAFF);
  }
}
