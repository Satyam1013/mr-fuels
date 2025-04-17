import { Model } from "mongoose";
import { Machine, MachineDocument } from "./machine.schema";
export declare class MachineService {
    private machineModel;
    constructor(machineModel: Model<MachineDocument>);
    createMachine(data: Partial<Machine>): Promise<import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateMachine(id: string, updates: Partial<Machine>): Promise<import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
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
    updateReading(id: string, startDayReading: number): Promise<import("mongoose").Document<unknown, {}, MachineDocument> & Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
