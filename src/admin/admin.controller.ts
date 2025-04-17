/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateUserDto, UpdateUserDto } from "src/auth/create-user.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("user")
  createUser(@Body() userData: CreateUserDto) {
    return this.adminService.createUser({
      ...userData,
      phoneNumber: userData.mobile,
    });
  }

  @Patch("user/:id")
  updateUser(@Param("id") id: string, @Body() userData: UpdateUserDto) {
    const updates: any = { ...userData };
    if (userData.mobile) updates.phoneNumber = userData.mobile;
    return this.adminService.updateUser(id, updates);
  }

  @Delete("user/:id")
  deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }
}
