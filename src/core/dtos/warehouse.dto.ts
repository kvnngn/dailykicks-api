import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ProfileDto } from "./profile.dto";

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdBy: ProfileDto;
}

export class WarehouseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdBy: ProfileDto;
}

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {}
