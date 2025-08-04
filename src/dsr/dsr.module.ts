import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DSR, DSRSchema } from "./dsr.schema";
import { DSRController } from "./dsr.controller";
import { DSRService } from "./dsr.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: DSR.name, schema: DSRSchema }])],
  providers: [DSRService],
  controllers: [DSRController],
  exports: [MongooseModule],
})
export class DSRModule {}
