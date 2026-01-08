import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Machine, MachineSchema } from "./machines.schema";
import { MachineService } from "./machines.service";
import { MachineController } from "./machines.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Machine.name, schema: MachineSchema }]),
  ],
  providers: [MachineService],
  controllers: [MachineController],
})
export class MachineModule {}
