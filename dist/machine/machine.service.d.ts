import { Model } from "mongoose";
import { Machine, MachineDocument } from "./machine.schema";
import { CreateMachineDto, UpdateMachineDto } from "./machine.dto";
export declare class MachineService {
    private machineModel;
    constructor(machineModel: Model<MachineDocument>);
    createMachine(data: CreateMachineDto): Promise<import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateMachine(id: string, updates: UpdateMachineDto): Promise<import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteMachine(id: string): Promise<import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllMachines(): Promise<(import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    updateReading(id: string, startDayReading: number): Promise<(import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | undefined>;
}
