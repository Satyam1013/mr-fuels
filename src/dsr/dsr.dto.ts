import {
  IsArray,
  ValidateNested,
  IsString,
  IsEnum,
  ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";
import { TankInputType } from "./dsr.enum";

class TankConfigDto {
  @IsString()
  tankNo!: string;

  @IsEnum(TankInputType)
  inputType!: TankInputType;

  // ===== Manual Fields =====
  @ValidateIf((o: TankConfigDto) => o.inputType === TankInputType.MANUAL)
  @IsString()
  capacity?: string;

  @ValidateIf((o: TankConfigDto) => o.inputType === TankInputType.MANUAL)
  @IsString()
  diameter?: string;

  @ValidateIf((o: TankConfigDto) => o.inputType === TankInputType.MANUAL)
  @IsString()
  length?: string;

  @ValidateIf((o: TankConfigDto) => o.inputType === TankInputType.MANUAL)
  @IsString()
  tankType?: string;

  // ===== Chart Field =====
  @ValidateIf((o: TankConfigDto) => o.inputType === TankInputType.CHART)
  @IsString()
  dsrChart?: string;
}

export class CreateDsrDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TankConfigDto)
  tankConfig!: TankConfigDto[];
}
