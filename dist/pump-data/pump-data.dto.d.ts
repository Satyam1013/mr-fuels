export declare enum PumpDataType {
    DAILY = "daily",
    MONTHLY = "monthly"
}
export declare class GetPumpDataDto {
    date: string;
    type: PumpDataType;
}
