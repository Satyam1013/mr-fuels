import { MachineService } from "./machine.service";
import { CreateMachineDto, UpdateMachineDto, UpdateReadingDto } from "./machine.dto";
export declare class MachineController {
    private readonly machineService;
    constructor(machineService: MachineService);
    create(data: CreateMachineDto): Promise<import("mongoose").Document<unknown, {}, import("./machine.schema").MachineDocument> & import("./machine.schema").Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, updates: UpdateMachineDto): Promise<import("mongoose").Document<unknown, {}, import("./machine.schema").MachineDocument> & import("./machine.schema").Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, import("./machine.schema").MachineDocument> & import("./machine.schema").Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllMachines(): Promise<(import("mongoose").Document<unknown, {}, import("./machine.schema").MachineDocument> & import("./machine.schema").Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    updateReading(id: string, data: UpdateReadingDto): Promise<import("mongoose").Document<unknown, {}, import("./machine.schema").MachineDocument> & import("./machine.schema").Machine & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
