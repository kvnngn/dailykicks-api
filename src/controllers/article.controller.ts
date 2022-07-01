import { ArticleDto } from "../core/dtos/article.dto";
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
   * Retrieves a particular product
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Product>>} queried product data
   */
  @Get("/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Product Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Product Request Failed" })
  async getArticleArticles(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") id: string,
  ): Promise<PageDto<ArticleDto>> {
    return await this.articleService.get(pageOptionsDto, id);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateArticleDto} payload the registration dto
   */
  @Post("add")
  @ApiResponse({ status: 200, description: "Article Creation Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async add(@Body() payload: CreateArticleDto): Promise<ArticleDto> {
    return this.articleService.create(payload);
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
