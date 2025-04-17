import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Admin, AdminSchema } from "./admin.schema";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    UserModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
