import { ArticleDto } from "./../core/dtos/article.dto";
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
  CreateWarehouseDto,
  PageDto,
  PageOptionsDto,
  UpdateWarehouseDto,
  WarehouseDto,
} from "core/dtos";
import WarehouseService from "services/warehouse.service";
import ArticleService from "../services/article.service";

/**
 * Warehouse Controller
 */
@ApiBearerAuth()
@ApiTags("warehouse")
@Controller("api/warehouse")
export class WarehouseController {
  warehouseUseCases: any;
  /**
   * Constructor
   * @param WarehouseUseCases
   */
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * Retrieves a particular warehouse
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Warehouse>>} queried warehouse data
   */
  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Warehouse Request Failed" })
  async getStores(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<WarehouseDto>> {
    console.log({ pageOptionsDto });
    return await this.warehouseService.get(pageOptionsDto);
  }

  /**
   * Retrieves a particular product
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Product>>} queried product data
   */
  @Get("/:id/articles")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Product Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Product Request Failed" })
  async getWarehouseArticles(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") id: string,
  ): Promise<PageDto<ArticleDto>> {
    return await this.articleService.get(pageOptionsDto, id);
  }

  /**
   * Retrieves a particular warehouse
   * @param id the warehouse given id to fetch
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  @Get("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Warehouse Request Failed" })
  async getWarehouseById(@Param("id") id: string) {
    const warehouse = await this.warehouseService.getById(id);
    if (!warehouse) {
      throw new BadRequestException(
        "The warehouse with that id could not be found.",
      );
    }
    return warehouse;
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateWarehouseDto} payload the registration dto
   */
  @Post("add")
  @ApiResponse({ status: 200, description: "Warehouse Creation Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async add(@Body() payload: CreateWarehouseDto): Promise<WarehouseDto> {
    return this.warehouseService.create(payload);
  }

  /**
   * Edit a warehouse
   * @param {UpdateWarehouseDto} payload
   * @returns {Promise<Warehouse>} mutated warehouse data
   */
  @Put("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Put Warehouse Request Failed" })
  async update(@Param("id") id: string, @Body() payload: UpdateWarehouseDto) {
    return await this.warehouseService.update(id, payload);
  }

  /**
   * Removes a warehouse from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the warehouse has been deleted
   */
  @Delete("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({
    status: 200,
    description: "Delete Warehouse Request Received",
  })
  @ApiResponse({ status: 400, description: "Delete Warehouse Request Failed" })
  async delete(@Param("id") id: string) {
    return await this.warehouseService.delete(id);
  }
}
