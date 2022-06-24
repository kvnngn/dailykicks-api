import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  IsNumber,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ProfileDto } from "./profile.dto";
import { BrandDto } from "./brand.dto";
import { BrandModelDto } from "./brandModel.dto";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  images_url: string[];

  @IsArray()
  colors: string[];

  @IsNumber()
  price: number;

  brand: BrandDto;
  model: BrandModelDto;
  createdBy: ProfileDto;
}

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdBy: ProfileDto;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
