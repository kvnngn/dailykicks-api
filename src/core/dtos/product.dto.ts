import { IsString, IsNotEmpty, IsArray } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ProfileDto } from "./profile.dto";
import { BrandDto } from "./brand.dto";
import { BrandModelDto } from "./brandModel.dto";

export class CreateProductDto {
  image_url: string;
  sku: string;
  brand: BrandDto;
  brandModel: BrandModelDto;
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

export class UpdateProductDto {
  image_url: string;
  sku: string;
  brand: BrandDto;
  brandModel: BrandModelDto;
  updatedBy: ProfileDto;
}
