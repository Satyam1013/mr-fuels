import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  ValidateIf,
} from "class-validator";
import { PrepaidModeEnum, PrepaidProductTypeEnum } from "./prepaid.enum";
import { FuelType } from "../common/enums/fuel-type.enum";

export class CreatePrepaidDto {
  @IsMongoId()
  customerId!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  date!: string;

  @IsNumber()
  shiftNumber!: number;

  @IsMongoId()
  creditBy!: string;

  @IsEnum(PrepaidModeEnum)
  mode!: PrepaidModeEnum;

  // ── Transit fields ──
  @ValidateIf((o: CreatePrepaidDto) => o.mode === PrepaidModeEnum.TRANSIT)
  @IsEnum(PrepaidProductTypeEnum)
  productType?: PrepaidProductTypeEnum;

  // Fuel select kiya
  @ValidateIf(
    (o: CreatePrepaidDto) => o.productType === PrepaidProductTypeEnum.FUEL,
  )
  @IsEnum(FuelType)
  fuelType?: FuelType;

  // NonFuel select kiya
  @ValidateIf(
    (o: CreatePrepaidDto) => o.productType === PrepaidProductTypeEnum.NON_FUEL,
  )
  @IsMongoId()
  nonFuelProductId?: string;

  // Dono cases mein quantity required
  @ValidateIf((o: CreatePrepaidDto) => o.mode === PrepaidModeEnum.TRANSIT)
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  narration?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
