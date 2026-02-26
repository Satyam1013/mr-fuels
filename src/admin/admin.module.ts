import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "./admin.schema";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Plan, PlanSchema } from "../plan-details/plan-details.schema";
import {
  Subscription,
  SubscriptionSchema,
} from "../subscription/subscription.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [MongooseModule, AdminService],
})
export class AdminModule {}
