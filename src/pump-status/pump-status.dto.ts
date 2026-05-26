import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsEnum, IsMongoId, IsOptional } from "class-validator";

export class CreatePumpStatusDto {
  @IsEnum(["active", "inactive", "maintenance"])
  status!: string;

  @IsMongoId()
  handledBy!: string;

  @IsEnum(["Admin", "Manager", "Staff"])
  handledByModel!: string;

  @IsOptional()
  @IsString()
  lastUpdatedAt?: string;
}

export class UpdatePumpStatusDto extends PartialType(CreatePumpStatusDto) {}
