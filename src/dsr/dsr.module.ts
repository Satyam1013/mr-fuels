import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DsrDetails, DsrDetailsSchema } from "./dsr.schema";
import { DsrDetailsService } from "./dsr.service";
import { DsrDetailsController } from "./dsr.controller";
import { Admin, AdminSchema } from "../admin/admin.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DsrDetails.name, schema: DsrDetailsSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  providers: [DsrDetailsService],
  controllers: [DsrDetailsController],
})
export class DsrDetailsModule {}
