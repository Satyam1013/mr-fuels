import { FuelType } from "./machine.schema";
export declare class CreateMachineDto {
    machineNo: string;
    nozzleNo: string;
    fuelType: FuelType;
    isActive?: boolean;
}
declare const UpdateMachineDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMachineDto>>;
export declare class UpdateMachineDto extends UpdateMachineDto_base {
}
export declare class UpdateReadingDto {
    startDayReading: number;
}
export {};
