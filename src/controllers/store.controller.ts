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
  CreateStoreDto,
  PageDto,
  PageOptionsDto,
  UpdateStoreDto,
  StoreDto,
  ArticleDto,
} from "core/dtos";
import StoreService from "services/store.service";
import ArticleService from "../services/article.service";

/**
 * Store Controller
 */
@ApiBearerAuth()
@ApiTags("store")
@Controller("api/store")
export class StoreController {
  storeUseCases: any;
  /**
   * Constructor
   * @param StoreUseCases
   */
  constructor(
    private readonly storeService: StoreService,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * Retrieves a particular store
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Store>>} queried store data
   */
  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Store Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Store Request Failed" })
  async getStores(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StoreDto>> {
    return await this.storeService.get(pageOptionsDto);
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
  async getStoreArticles(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") id: string,
  ): Promise<PageDto<ArticleDto>> {
    return await this.articleService.get(pageOptionsDto, id);
  }

  /**
   * Retrieves a particular store
   * @param id the store given id to fetch
   * @returns {Promise<IStore>} queried store data
   */
  @Get("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Store Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Store Request Failed" })
  async getStoreById(@Param("id") id: string) {
    const store = await this.storeService.getById(id);
    if (!store) {
      throw new BadRequestException(
        "The store with that id could not be found.",
      );
    }
    return store;
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateStoreDto} payload the registration dto
   */
  @Post("add")
  @ApiResponse({ status: 200, description: "Store Creation Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async add(@Body() payload: CreateStoreDto): Promise<StoreDto> {
    return this.storeService.create(payload);
  }

  /**
   * Edit a store
   * @param {UpdateStoreDto} payload
   * @returns {Promise<Store>} mutated store data
   */
  @Put("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Store Request Received" })
  @ApiResponse({ status: 400, description: "Put Store Request Failed" })
  async update(@Param("id") id: string, @Body() payload: UpdateStoreDto) {
    return await this.storeService.update(id, payload);
  }

  /**
   * Removes a store from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the store has been deleted
   */
  @Delete("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({
    status: 200,
    description: "Delete Store Request Received",
  })
  @ApiResponse({ status: 400, description: "Delete Store Request Failed" })
  async delete(@Param("id") id: string) {
    return await this.storeService.delete(id);
  }
}
