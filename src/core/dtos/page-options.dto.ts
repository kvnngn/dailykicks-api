import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

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

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 7,
    default: new Date().getDay(),
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(7)
  @IsOptional()
  readonly weekday: number;

  @ApiPropertyOptional({
    minimum: 0,
    maximum: 24,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(24)
  @IsOptional()
  readonly startHour: number;

  @ApiPropertyOptional({
    minimum: 0,
    maximum: 24,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(24)
  @IsOptional()
  readonly endHour: number;
  customer: any;
}
