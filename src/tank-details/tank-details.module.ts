import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TankDetails, TankDetailsSchema } from "./tank-details.schema";
import { TankController } from "./tank-details.controller";
import { TankService } from "./tank-details.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TankDetails.name,
        schema: TankDetailsSchema,
      },
    ]),
  ],
  controllers: [TankController],
  providers: [TankService],
  exports: [TankService],
})
export class TankModule {}
