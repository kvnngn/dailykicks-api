import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsAlphanumeric } from "class-validator";

export class BrandDto {
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  name: string;
}
