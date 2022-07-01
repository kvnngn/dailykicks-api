import { CreateArticleDto, UpdateArticleDto } from "core/dtos";
import { Model } from "mongoose";
import { PageDto, PageMetaDto, PageOptionsDto, ArticleDto } from "../core/dtos";
import { Article, ArticleDocument } from "models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import _ from "lodash";

@Injectable()
class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<ArticleDocument>,
  ) {}

  /**
   * Create a warehouse with Create fields
   * @param {Create} payload warehouse payload
   * @returns {Promise<Article>} created warehouse data
   */
  async create(payload: CreateArticleDto) {
    let createdArticle = await this.articleModel.create({
      ...payload,
    });

    return createdArticle;
  }

  async get(
    pageOptionsDto: PageOptionsDto,
    warehouseId: string,
  ): Promise<PageDto<ArticleDto>> {
    const PAGE_SIZE = pageOptionsDto.limit;
    const name = pageOptionsDto.searchQuery || ".";

    let entities = await this.articleModel
      .find({
        name: { $regex: new RegExp(name, "i") },
        warehouse: warehouseId,
      })
      .sort(pageOptionsDto.sort)
      .skip(pageOptionsDto.skip)
      .limit(PAGE_SIZE)
      .populate([
        { path: "createdBy", model: "Profile" },
        { path: "product", model: "Product" },
      ]);
    let itemCount = await this.articleModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Fetches a warehouse from database by id
   * @param {string} id
   * @returns {Promise<Article>} queried warehouse data
   */
  getById(id: string) {
    return this.articleModel
      .findOne({
        _id: id,
      })
      .populate([
        { path: "createdBy", model: "Profile" },
        { path: "product", model: "Product" },
      ]);
  }

  async update(id: string, articleData: UpdateArticleDto) {
    const article = await this.articleModel
      .findByIdAndUpdate({ _id: id }, articleData, { new: true })
      .populate([{ path: "createdBy", model: "Profile" }]);
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  async delete(id: string) {
    const warehouse = await this.articleModel.remove({ _id: id });
    return warehouse;
  }
}

export default ArticleService;
