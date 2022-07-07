import { ProductDto } from "./product.dto";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";
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

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  transferPrice: number;
}

export class TransferArticleToWarehouseDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  updatedBy: string;
}

export class SellArticleDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  sellingPrice: number;
}
