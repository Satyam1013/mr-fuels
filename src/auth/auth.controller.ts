import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("admin/signup")
  adminSignup(
    @Body("email") email: string,
    @Body("password") password: string,
  ) {
    return this.authService.adminSignup(email, password);
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
}
