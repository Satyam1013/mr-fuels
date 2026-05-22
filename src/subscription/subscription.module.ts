import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Subscription, SubscriptionSchema } from "./subscription.schema";
import { SubscriptionScheduler } from "./subscription.scheduler";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [SubscriptionScheduler],
  exports: [MongooseModule],
})
export class SubscriptionModule {}
