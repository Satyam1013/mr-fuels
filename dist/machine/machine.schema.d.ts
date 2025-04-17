import { Document } from "mongoose";
export type MachineDocument = Machine & Document;
export declare enum FuelType {
    PETROL = "Petrol",
    DIESEL = "Diesel",
    POWER = "Power"
}
export declare class Machine {
    machineNo: string;
    nozzleNo: string;
    fuelType: FuelType;
    readings: {
        date: Date;
        reading: number;
    }[];
}
export declare const MachineSchema: import("mongoose").Schema<Machine, import("mongoose").Model<Machine, any, any, any, Document<unknown, any, Machine> & Machine & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Machine, Document<unknown, {}, import("mongoose").FlatRecord<Machine>> & import("mongoose").FlatRecord<Machine> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
