import { ProductDto } from "./product.dto";
import { IsString, IsNotEmpty, IsBoolean, IsNumber } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ProfileDto } from "./profile.dto";
import { WarehouseDto } from "./warehouse.dto";

export class CreateArticleDto {
  createdBy: string;
  product: string;
  warehouse: string;
  sold: boolean;
  soldAt: Date;
  transferedAt: Date;
  transfered: Boolean;
  storehousePrice: number;
  size: number;
  shopPrice: number;
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
  sku: string;

  @IsBoolean()
  sold: boolean;

  @IsString()
  soldAt: Date;

  @IsString()
  transferedAt: Date;

  @IsBoolean()
  transfered: Boolean;

  @IsNumber()
  storehousePrice: number;

  @IsNumber()
  shopPrice: number;

  @IsNumber()
  size: number;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}