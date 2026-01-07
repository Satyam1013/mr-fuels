import { IsArray, IsString } from "class-validator";

export class CreateProductDetailsDto {
  @IsArray()
  @IsString({ each: true })
  selectedProducts!: string[];
}
