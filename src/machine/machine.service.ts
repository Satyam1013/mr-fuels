import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Machine, MachineDocument } from "./machine.schema";

@Injectable()
export class MachineService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<MachineDocument>,
  ) {}

  async createMachine(data: Partial<Machine>) {
    try {
      const machine = new this.machineModel(data);
      return await machine.save();
    } catch (error) {
      console.error("Create Machine Error:", error);
      throw new InternalServerErrorException("Could not create machine");
    }
  }

  async updateMachine(id: string, updates: Partial<Machine>) {
    try {
      const updated = await this.machineModel.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!updated) throw new NotFoundException("Machine not found");
      return updated;
    } catch (error) {
      console.error("Update Machine Error:", error);
      throw new InternalServerErrorException("Could not update machine");
    }
  }

  async deleteMachine(id: string) {
    try {
      const deleted = await this.machineModel.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundException("Machine not found");
      return deleted;
    } catch (error) {
      console.error("Delete Machine Error:", error);
      throw new InternalServerErrorException("Could not delete machine");
    }
  }

  async getAllMachines() {
    return this.machineModel
      .find()
      .select("machineNo nozzleNo fuelType readings");
  }

  async updateReading(id: string, startDayReading: number) {
    try {
      const machine = await this.machineModel.findById(id);
      if (!machine) throw new NotFoundException("Machine not found");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // normalize to midnight

      machine.readings.push({
        date: tomorrow,
        reading: startDayReading,
      });

      return await machine.save();
    } catch (err) {
      console.error("Error updating reading", err);
      throw new InternalServerErrorException("Failed to update reading");
    }
  }
}
