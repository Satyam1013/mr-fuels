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

  // @Post("add-pump-details")
  // async addPumpDetails(@Body() dto: PumpDetailsDto) {
  //   return this.authService.addPumpDetails(dto);
  // }

  // @Public()
  // @Get("check-used-mobiles")
  // checkUsedMobiles(@Query("numbers") numbers: string) {
  //   return this.authService.checkUsedMobiles(numbers);
  // }

  @Public()
  @Post("login")
  login(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  // @Public()
  // @Post("refresh-token")
  // refreshAccessToken(@Body("refresh_token") refreshToken: string) {
  //   return this.authService.refreshAccessToken(refreshToken);
  // }

  // @Public()
  // @Post("logout")
  // logout(@Body() body: { mobileNo: string; role: "admin" | "manager" }) {
  //   return this.authService.logout(body.mobileNo, body.role);
  // }
}
