import { UserRole } from "src/user/user.schema";
export declare class CreateUserDto {
    managerName: string;
    managerPassword: string;
    managerMobile: string;
    shift: string;
    role: UserRole;
}
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export declare class NozzleDto {
    nozzleType: string;
}
export declare class MachineDto {
    machineNo: string;
    nozzleCount: number;
    nozzles: NozzleDto[];
}
export declare class TankDto {
    type: string;
    number: number;
}
export declare class CreateAdminDto {
    businessName: string;
    businessEmail: string;
    mobileNo: string;
    password: string;
    tankCapacity: TankDto[];
    machines: MachineDto[];
}
export {};
