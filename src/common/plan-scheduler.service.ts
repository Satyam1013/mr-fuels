import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Admin, AdminDocument } from "src/admin/admin.schema";
import { Model } from "mongoose";

@Injectable()
export class PlanSchedulerService {
  private readonly logger = new Logger(PlanSchedulerService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  // Run every Sunday at 11:59 PM
  @Cron("59 23 * * 0")
  async handlePlanUpgrade() {
    try {
      const now = new Date();

      // Find expired free trial users
      const expiredAdmins = await this.adminModel.find({
        planType: "free",
        planExpiresAt: { $lte: now },
      });

      if (expiredAdmins.length === 0) {
        this.logger.log("No expired free trial accounts found");
        return;
      }

      const result = await this.adminModel.updateMany(
        {
          planType: "free",
          planExpiresAt: { $lte: now },
        },
        {
          $set: {
            paidUser: false,
          },
        },
      );

      this.logger.log(
        `Marked ${result.modifiedCount} admins as expired trial users`,
      );
    } catch (err) {
      this.logger.error("Error in plan expiration cron job", err);
    }
  }
}
