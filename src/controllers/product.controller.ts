import { AuthGuard } from "@nestjs/passport";
import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  UseGuards,
  Param,
  BadRequestException,
  Put,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  CreateProductDto,
  PageDto,
  PageOptionsDto,
  UpdateProductDto,
  ProductDto,
} from "core/dtos";
import ProductService from "services/product.service";
import BrandModelService from "../services/brandModel.service";
import BrandService from "../services/brand.service";

/**
 * Product Controller
 */
@ApiBearerAuth()
@ApiTags("product")
@Controller("api/product")
export class ProductController {
  productUseCases: any;
  /**
   * Constructor
   * @param ProductUseCases
   */
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly brandModelService: BrandModelService,
  ) {}

  /**
   * Retrieves a particular product
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Product>>} queried product data
   */
  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Product Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Product Request Failed" })
  async getStores(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    console.log({ pageOptionsDto });
    return await this.productService.get(pageOptionsDto);
  }

  /**
   * Retrieves a particular product
   * @param id the product given id to fetch
   * @returns {Promise<IProduct>} queried product data
   */
  @Get("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Product Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Product Request Failed" })
  async getProductById(@Param("id") id: string) {
    const product = await this.productService.getById(id);
    if (!product) {
      throw new BadRequestException(
        "The product with that id could not be found.",
      );
    }
    return product;
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateProductDto} payload the registration dto
   */
  @Post("add")
  @ApiResponse({ status: 200, description: "Product Creation Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async add(@Body() payload: CreateProductDto): Promise<ProductDto> {
    console.log(payload);
    return this.productService.create(payload);
  }

  /**
   * Edit a product
   * @param {UpdateProductDto} payload
   * @returns {Promise<Product>} mutated product data
   */
  @Put("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Product Request Received" })
  @ApiResponse({ status: 400, description: "Put Product Request Failed" })
  async update(@Param("id") id: string, @Body() payload: UpdateProductDto) {
    return await this.productService.update(id, payload);
  }

  /**
   * Removes a product from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the product has been deleted
   */
  @Delete("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({
    status: 200,
    description: "Delete Product Request Received",
  })
  @ApiResponse({ status: 400, description: "Delete Product Request Failed" })
  async delete(@Param("id") id: string) {
    return await this.productService.delete(id);
  }
}
