import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsAlphanumeric } from "class-validator";
import { BrandDto } from "./brand.dto";

export class BrandModelDto {
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  name: string;

  brand: BrandDto;
}
