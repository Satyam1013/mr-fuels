/* eslint-disable @typescript-eslint/require-await */
import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminModule } from "../admin/admin.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PlanSchedulerService } from "src/common/plan-scheduler.service";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
    UserModule,
    forwardRef(() => AdminModule),
  ],
  providers: [AuthService, PlanSchedulerService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
