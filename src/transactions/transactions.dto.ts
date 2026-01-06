import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class UpiAppDto {
  @IsString()
  name!: string;

  @IsString()
  merchantId!: string;
}

export class CreateTransactionDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpiAppDto)
  upiApps!: UpiAppDto[];

  @IsString()
  swipeSettlement!: string;

  @IsString()
  swipeStatement!: string;

  @IsString()
  bankDeposit!: string;
}
