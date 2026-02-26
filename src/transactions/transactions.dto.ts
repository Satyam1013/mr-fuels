import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class UpiAppDto {
  @IsString()
  name!: string;
}

export class CreateTransactionDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpiAppDto)
  upiApps!: UpiAppDto[];

  @IsString()
  swipeSettlement!: string;

  @IsOptional()
  @IsString()
  swipeStatement?: string;

  @IsString()
  bankDeposit!: string;
}
