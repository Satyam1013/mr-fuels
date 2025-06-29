export declare class FuelDto {
    value: string;
    kl: number;
    pdf: object;
}
export declare class BusinessDetailsDto {
    businessName: string;
    businessEmail: string;
    businessPhoneNo: string;
    fuelTypes: string[];
    fuels: FuelDto[];
}
export declare class NozzleDto {
    nozzleType: string;
}
export declare class MachineDto {
    machineNo: number;
    nozzleCount: number;
    nozzles: NozzleDto[];
}
export declare class MachineDetailsDto {
    numberOfMachines: number;
    machines: MachineDto[];
}
export declare class PumpDetailsDto {
    businessUpiApps: string[];
    swipeStatement: string;
    bankDeposit: string;
    noOfEmployeeShifts: number;
    shiftDetails: number;
}
export declare class ManagerDto {
    name: string;
    mobile: string;
    aadhar: object;
    shift: number;
    password: string;
}
export declare class ManagerDetailsDto {
    numberOfManagers: number;
    managers: ManagerDto[];
}
export declare class CreateAdminDto {
    businessDetails: BusinessDetailsDto;
    machineDetails: MachineDetailsDto;
    pumpDetails: PumpDetailsDto;
    managerDetails: ManagerDetailsDto;
    adminPassword: string;
}
