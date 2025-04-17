import { UserRole } from "src/user/user.schema";
export declare class CreateUserDto {
    email: string;
    username: string;
    password: string;
    role: UserRole;
    mobile: string;
}
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
