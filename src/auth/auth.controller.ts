import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAdminDto } from "./create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  adminSignup(@Body() body: CreateAdminDto) {
    return this.authService.adminSignup(body);
  }

  @Post("admin/login")
  adminLogin(
    @Body("mobileNo") mobileNo: string,
    @Body("password") password: string,
  ) {
    return this.authService.adminLogin(mobileNo, password);
  }

  @Post("manager/create")
  createManager(@Body() body: any) {
    return this.authService.createManager(body);
  }

  @Post("manager/login")
  managerLogin(
    @Body("managerName") managerName: string,
    @Body("managerPassword") managerPassword: string,
  ) {
    return this.authService.managerLogin(managerName, managerPassword);
  }
}
