import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";
import { AdminLoginDto, CreateAdminDto } from "./create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  async signup(@Body() dto: CreateAdminDto) {
    return this.authService.adminSignup(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }
}
