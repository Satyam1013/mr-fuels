import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlanService } from "./plan-details.service";
import { PlanController } from "./plan-details.controller";
import { Plan, PlanSchema } from "./plan-details.schema";
import {
  Subscription,
  SubscriptionSchema,
} from "../subscription/subscription.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
