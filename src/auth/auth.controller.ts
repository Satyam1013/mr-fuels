import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAdminDto, CreateUserDto } from "./create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  adminSignup(@Body() body: CreateAdminDto) {
    return this.authService.adminSignup(body);
  }

  @Post("admin/login")
  adminLogin(@Body("email") email: string, @Body("password") password: string) {
    return this.authService.adminLogin(email, password);
  }

  @Post("manager/login")
  managerLogin(
    @Body("username") username: string,
    @Body("password") password: string,
  ) {
    return this.authService.managerLogin(username, password);
  }

  @Post("manager/create")
  createManager(@Body() body: CreateUserDto) {
    return this.authService.createManager(body);
  }
}
