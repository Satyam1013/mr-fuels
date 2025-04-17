import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminModule } from "../admin/admin.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    AdminModule,
    UserModule,
    AdminModule,
    JwtModule.register({
      secret: "supersecret",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
