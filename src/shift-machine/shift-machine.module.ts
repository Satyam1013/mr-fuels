import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ShiftMachineController } from "./shift-machine.controller";
import { ShiftMachineService } from "./shift-machine.service";
import { ShiftMachineEntry, ShiftMachineSchema } from "./shift-machine.schema";
import { Machine, MachineSchema } from "../machines/machines.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShiftMachineEntry.name, schema: ShiftMachineSchema },
      { name: Machine.name, schema: MachineSchema },
    ]),
  ],
  controllers: [ShiftMachineController],
  providers: [ShiftMachineService],
})
export class ShiftMachineModule {}
