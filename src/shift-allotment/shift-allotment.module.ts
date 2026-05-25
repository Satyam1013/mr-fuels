import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShiftAllotmentController } from "./shift-allotment.controller";
import { ShiftAllotmentService } from "./shift-allotment.service";
import { ShiftAllotment, ShiftAllotmentSchema } from "./shift-allotment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShiftAllotment.name, schema: ShiftAllotmentSchema },
    ]),
  ],
  controllers: [ShiftAllotmentController],
  providers: [ShiftAllotmentService],
})
export class ShiftAllotmentModule {}
