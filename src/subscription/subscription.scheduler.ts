import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Subscription } from "./subscription.schema";
import { SubscriptionStatus } from "./subscription.enum";

@Injectable()
export class SubscriptionScheduler {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
  ) {}

  // ─── Har raat 12 baje chalega ─────────────────────────
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireSubscriptions() {
    const now = new Date();

    const result = await this.subscriptionModel.updateMany(
      {
        status: SubscriptionStatus.ACTIVE,
        expiryDate: { $lt: now }, // expiry date nikal gayi
      },
      {
        $set: { status: SubscriptionStatus.EXPIRED },
      },
    );

    console.log(`✅ Expired ${result.modifiedCount} subscriptions`);
  }
}
