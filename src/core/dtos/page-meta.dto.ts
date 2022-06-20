import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDtoParameters } from "core/interfaces";

export class PageMetaDto {
  @ApiProperty()
  readonly offset: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly searchQuery: string;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.limit = pageOptionsDto.limit;
    this.offset = pageOptionsDto.offset;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit || 15);
    this.page = Math.ceil(
      this.pageCount - (this.itemCount - this.offset || 0) / this.limit,
    );
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
