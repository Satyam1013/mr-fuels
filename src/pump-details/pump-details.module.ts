import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PumpDetailsController } from "./pump-details.controller";
import { PumpDetailsService } from "./pump-details.service";
import { PumpDetails, PumpDetailsSchema } from "./pump-details.schema";
import { Admin, AdminSchema } from "../admin/admin.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PumpDetails.name, schema: PumpDetailsSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [PumpDetailsController],
  providers: [PumpDetailsService],
})
export class PumpDetailsModule {}
