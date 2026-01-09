import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DsrDetails, DsrDetailsSchema } from "./dsr.schema";
import { DsrDetailsService } from "./dsr.service";
import { DsrDetailsController } from "./dsr.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DsrDetails.name, schema: DsrDetailsSchema },
    ]),
  ],
  providers: [DsrDetailsService],
  controllers: [DsrDetailsController],
})
export class DsrDetailsModule {}
