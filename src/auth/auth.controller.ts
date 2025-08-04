import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAdminDto, LoginDto } from "./create-user.dto";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  adminSignup(@Body() body: CreateAdminDto) {
    return this.authService.adminSignup(body);
  }

  @Public()
  @Get("check-used-mobiles")
  checkUsedMobiles(@Query("numbers") numbers: string) {
    return this.authService.checkUsedMobiles(numbers);
  }

  @Public()
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body.mobileNo, body.password);
  }

  @Public()
  @Post("refresh-token")
  refreshAccessToken(@Body("refresh_token") refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Public()
  @Post("logout")
  logout(@Body() body: { mobileNo: string; role: "admin" | "manager" }) {
    return this.authService.logout(body.mobileNo, body.role);
  }
}
