import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlanService } from "./plan-details.service";
import { PlanController } from "./plan-details.controller";
import { Plan, PlanSchema } from "./plan-details.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
  ],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
