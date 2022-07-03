import { IsString, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ProfileDto } from "./profile.dto";

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdBy: ProfileDto;
}

export class StoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdBy: ProfileDto;
}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
