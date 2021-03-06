import {
  ArticleDto,
  RevertSellArticleDto,
  SellArticleDto,
  TransferArticleDto,
  TransferArticleToWarehouseDto,
} from "../core/dtos/article.dto";
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
  CreateArticleDto,
  PageDto,
  PageOptionsDto,
  UpdateArticleDto,
} from "core/dtos";
import ArticleService from "../services/article.service";

/**
 * Article Controller
 */
@ApiBearerAuth()
@ApiTags("article")
@Controller("api/article")
export class ArticleController {
  articleUseCases: any;
  /**
   * Constructor
   * @param ArticleUseCases
   */
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Retrieves articles from specific warehouse
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Article>>} queried article data
   */
  @Get("/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Article Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Article Request Failed" })
  async getArticles(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") warehouseId: string,
  ): Promise<PageDto<ArticleDto>> {
    return await this.articleService.get(pageOptionsDto, warehouseId);
  }

  /**
   * Retrieves articles from specific warehouse
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Article>>} queried article data
   */
  @Get("/:id/store/byproducts")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Article Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Article Request Failed" })
  async getStoreInventory(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") warehouseId: string,
  ): Promise<PageDto<ArticleDto>> {
    return await this.articleService.getStoreInventory(
      pageOptionsDto,
      warehouseId,
    );
  }

  /**
   * Retrieves articles from specific warehouse
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Article>>} queried article data
   */
  @Get("/:id/warehouse/byproducts")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Article Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Article Request Failed" })
  async getWarehouseInventory(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") warehouseId: string,
  ): Promise<PageDto<ArticleDto>> {
    return await this.articleService.getWarehouseInventory(
      pageOptionsDto,
      warehouseId,
    );
  }

  /**
   * Retrieves articles from specific warehouse
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<{ brands: BrandDto[]; brandModels: BrandModelDto[]}>}
   * queried article data
   */
  @Get("/acdata")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Article Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Article Request Failed" })
  async getArticleAutocomplete(): Promise<{
    brands: string[];
    brandModels: string[];
  }> {
    return await this.articleService.getAcdata();
  }

  /**
   * Retrieves a particular article
   * @returns {Promise<Article>} queried article data
   */
  @Get("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Article Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Article Request Failed" })
  async getArticleById(@Param("id") articleId: string): Promise<ArticleDto> {
    return await this.articleService.getById(articleId);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateArticleDto} payload the registration dto
   */
  @Post("add")
  @ApiResponse({ status: 200, description: "Article Creation Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async add(@Body() payload: CreateArticleDto): Promise<ArticleDto[]> {
    const articles = [];
    payload.sizes.forEach(async (sizeType) => {
      for (let i = 0; i < sizeType.quantity; i++) {
        const article = await this.articleService.create({
          ...payload,
          size: sizeType.size,
        });
        articles.push(article);
      }
    });

    return articles;
  }

  /**
   * Edit a article
   * @param {UpdateArticleDto} payload
   * @returns {Promise<Article>} mutated article data
   */
  @Put("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Article Request Received" })
  @ApiResponse({ status: 400, description: "Put Article Request Failed" })
  async update(@Param("id") id: string, @Body() payload: UpdateArticleDto) {
    return await this.articleService.update(id, payload);
  }

  /**
   * Transfer a article
   * @param {TransferArticleDto} payload
   * @returns {Promise<Article>} mutated article data
   */
  @Put("/transfer/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Article Request Received" })
  @ApiResponse({ status: 400, description: "Put Article Request Failed" })
  async transfer(@Param("id") id: string, @Body() payload: TransferArticleDto) {
    return await this.articleService.transferToStore(id, payload);
  }

  /**
   * Transfer a article to warehouse
   * @param {TransferArticleToWarehouseDto} payload
   * @returns {Promise<Article>} mutated article data
   */
  @Put("/transfer/:id/warehouse")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Article Request Received" })
  @ApiResponse({ status: 400, description: "Put Article Request Failed" })
  async transferToWarehouse(
    @Param("id") articleId: string,
    @Body() payload: TransferArticleToWarehouseDto,
  ) {
    return await this.articleService.transferToWarehouse(articleId, payload);
  }

  /**
   * Sell a article
   * @param {SellArticleDto} payload
   * @returns {Promise<Article>} mutated article data
   */
  @Put("/sell/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Article Request Received" })
  @ApiResponse({ status: 400, description: "Put Article Request Failed" })
  async sell(@Param("id") id: string, @Body() payload: SellArticleDto) {
    return await this.articleService.sell(id, payload);
  }

  /**
   * Sell a article
   * @param {SellArticleDto} payload
   * @returns {Promise<Article>} mutated article data
   */
  @Put("/cancelsell/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Article Request Received" })
  @ApiResponse({ status: 400, description: "Put Article Request Failed" })
  async revertSell(
    @Param("id") id: string,
    @Body() payload: RevertSellArticleDto,
  ) {
    return await this.articleService.revertSell(id, payload);
  }

  /**
   * Removes a article from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the article has been deleted
   */
  @Delete("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({
    status: 200,
    description: "Delete Article Request Received",
  })
  @ApiResponse({ status: 400, description: "Delete Article Request Failed" })
  async delete(@Param("id") id: string) {
    return await this.articleService.delete(id);
  }
}
