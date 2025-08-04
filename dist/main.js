"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-floating-promises */
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwt_1 = require("@nestjs/jwt");
const auth_guard_1 = require("./auth/auth.guard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });
    const reflector = app.get(core_1.Reflector);
    const jwtService = app.get(jwt_1.JwtService);
    app.useGlobalGuards(new auth_guard_1.AuthGuard(jwtService, reflector));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
