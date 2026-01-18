import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PumpTimingController } from "./pump-timing.controller";
import { PumpTimingService } from "./pump-timing.service";
import { PumpTiming, PumpTimingSchema } from "./pump-timing.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PumpTiming.name, schema: PumpTimingSchema },
    ]),
  ],
  controllers: [PumpTimingController],
  providers: [PumpTimingService],
  exports: [PumpTimingService],
})
export class PumpTimingModule {}
