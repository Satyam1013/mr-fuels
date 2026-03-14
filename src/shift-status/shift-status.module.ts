import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShiftStatus, ShiftStatusSchema } from "./shift-status.schema";
import { ShiftStatusService } from "./shift-status.service";
import { ShiftStatusController } from "./shift-status.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShiftStatus.name, schema: ShiftStatusSchema },
    ]),
  ],
  controllers: [ShiftStatusController],
  providers: [ShiftStatusService],
})
export class ShiftStatusModule {}
