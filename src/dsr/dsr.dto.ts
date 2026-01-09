import { IsArray, ValidateNested, IsString } from "class-validator";
import { Type } from "class-transformer";

class TankConfigDto {
  @IsString()
  tankNo!: string;
}

export class CreateDsrDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TankConfigDto)
  tankConfig!: TankConfigDto[];
}
