import { UserRole } from "src/user/user.schema";
export declare class CreateUserDto {
    username: string;
    password: string;
    mobile: string;
    role: UserRole;
    aadharImage: string;
    shift: number;
}
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export declare class CreateAdminDto {
    businessName: string;
    businessEmail: string;
    mobileNo: number;
    password: string;
    tankCapacity: Record<string, string>[];
    machines: {
        machineNo: number;
        nozel: string;
    }[];
}
export {};
