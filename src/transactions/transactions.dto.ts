import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class UpiAppDto {
  @IsString()
  name!: string;
}

class PosMachineDto {
  @IsString()
  name!: string;
}

export class CreateTransactionDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpiAppDto)
  upiApps!: UpiAppDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosMachineDto)
  posMachines!: PosMachineDto[];

  @IsString()
  swipeMachine!: string;

  @IsString()
  swipeSettlement!: string;

  @IsOptional()
  @IsString()
  swipeStatement?: string;

  @IsString()
  bankDeposit!: string;
}
