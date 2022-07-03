import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly offset: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly limit: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly searchQuery: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sort: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly filter: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly skip: number;
}
