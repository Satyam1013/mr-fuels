/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken() as JwtFromRequestFunction,
      secretOrKey:
        configService.get<string>("JWT_SECRET") ?? process.env.JWT_SECRET ?? "",
    });
  }

  async validate(payload: {
    sub: string;
    username?: string;
    role: string;
    mobileNo?: string;
    shift?: number;
    adminId?: string;
  }) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException("Invalid token");
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      mobileNo: payload.mobileNo,
      shift: payload.shift,
      adminId: payload.adminId,
    };
  }
}
