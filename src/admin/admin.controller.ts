/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateUserDto, UpdateUserDto } from "src/auth/create-user.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("user")
  createUser(@Body() body: CreateUserDto) {
    return this.adminService.createUser({
      ...body,
      phoneNumber: body.mobile,
    });
  }

  @Patch("user/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    const updates: any = { ...body };
    if (body.mobile) updates.phoneNumber = body.mobile;
    return this.adminService.updateUser(id, updates);
  }

  @Delete("user/:id")
  deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get("users/:role")
  getUsersByRole(@Param("role") role: string) {
    return this.adminService.findAllUsersByRole(role.toUpperCase());
  }
}
