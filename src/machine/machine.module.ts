import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Machine, MachineSchema } from "./machine.schema";
import { MachineService } from "./machine.service";
import { MachineController } from "./machine.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Machine.name, schema: MachineSchema }]),
  ],
  providers: [MachineService],
  controllers: [MachineController],
  exports: [MongooseModule, MachineService],
})
export class MachineModule {}
