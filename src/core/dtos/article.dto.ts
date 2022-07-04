import { ProductDto } from "./product.dto";
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsAlphanumeric,
  IsEmail,
  Matches,
  MinLength,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ProfileDto } from "./profile.dto";
import { WarehouseDto } from "./warehouse.dto";
import { StoreDto } from "./store.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleDto {
  createdBy: string;
  product: string;
  warehouse: string;
  store: string;
  soldAt: Date;
  transferedAt: Date;
  warehousePrice: number;
  size: number;
  storePrice: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  createdBy: ProfileDto;

  @IsString()
  @IsNotEmpty()
  product: ProductDto;

  @IsString()
  @IsNotEmpty()
  warehouse: WarehouseDto;

  @IsString()
  @IsNotEmpty()
  store: StoreDto;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  soldAt: Date;

  @IsString()
  transferedAt: Date;

  @IsNumber()
  warehousePrice: number;

  @IsNumber()
  storePrice: number;

  @IsNumber()
  size: number;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

export class TransferArticleDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  store: string;

  /**
   * Firstname field
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  /**
   * Lastname field
   */
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  transferPrice: number;
}
