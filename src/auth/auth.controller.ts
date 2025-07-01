import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAdminDto, LoginDto } from "./create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  adminSignup(@Body() body: CreateAdminDto) {
    return this.authService.adminSignup(body);
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body.mobileNo, body.password);
  }

  @Post("refresh-token")
  refreshAccessToken(@Body("refresh_token") refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
