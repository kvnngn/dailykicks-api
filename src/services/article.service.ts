import {
  CreateArticleDto,
  TransferArticleDto,
  UpdateArticleDto,
} from "core/dtos";
import { Model, Types } from "mongoose";
import { PageDto, PageMetaDto, PageOptionsDto, ArticleDto } from "../core/dtos";
import {
  Article,
  ArticleDocument,
  Brand,
  BrandDocument,
  BrandModel,
  BrandModelDocument,
} from "models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import _ from "lodash";

@Injectable()
class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<ArticleDocument>,
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
    @InjectModel(BrandModel.name)
    private brandModelModel: Model<BrandModelDocument>,
  ) {}

  /**
   * Create a warehouse with Create fields
   * @param {Create} payload warehouse payload
   * @returns {Promise<Article>} created warehouse data
   */
  async create(payload: CreateArticleDto) {
    console.log({ payload });
    let createdArticle = await this.articleModel.create({
      ...payload,
    });

    return createdArticle;
  }

  async get(
    pageOptionsDto: PageOptionsDto,
    warehouseId: string,
  ): Promise<PageDto<ArticleDto>> {
    console.log(pageOptionsDto);
    console.log(warehouseId);
    const filters = pageOptionsDto.filter;
    let pipeline = [];

    // match warehouse and populate references
    pipeline.push(
      {
        $match: {
          $or: [
            { warehouse: new Types.ObjectId(warehouseId) },
            { store: new Types.ObjectId(warehouseId) },
          ],
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "store",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    // match filters
    if (filters) {
      const parsedFilter = JSON.parse(filters);
      if (parsedFilter.brands) {
        const brands = (
          await this.brandModel.find(
            {
              name: { $in: parsedFilter.brands ? parsedFilter.brands : [] },
            },
            { _id: 1 },
          )
        ).map((item) => item._id);

        pipeline.push({
          $match: { "product.brand": { $in: brands } },
        });
      }
      if (parsedFilter.brandModels) {
        const brandModels = (
          await this.brandModelModel.find(
            {
              name: {
                $in: parsedFilter.brandModels ? parsedFilter.brandModels : [],
              },
            },
            { _id: 1 },
          )
        ).map((item) => item._id);

        pipeline.push({
          $match: { "product.brandModel": { $in: brandModels } },
        });
      }
      if (parsedFilter.sku) {
        pipeline.push({
          $match: { sku: parsedFilter.sku },
        });
      }
    }

    // add pagination, limit, sort
    pipeline.push(
      { $limit: Number(pageOptionsDto.limit) },
      { $skip: Number(pageOptionsDto.skip) },
    );

    // add sort
    if (pageOptionsDto.sort) {
      pipeline.push({ $sort: JSON.parse(pageOptionsDto.sort) });
    }

    console.log(pipeline);
    let entities = await this.articleModel.aggregate(pipeline);
    let itemCount = await this.articleModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getAcdata(): Promise<{
    brands: string[];
    brandModels: string[];
  }> {
    const brands = await (
      await this.brandModel.find({}, { name: 1, _id: 0 })
    ).map((item) => item.name);
    const brandModels = (
      await this.brandModelModel.find({}, { name: 1, _id: 0 })
    ).map((item) => item.name);
    return { brands, brandModels };
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

  async transfer(id: string, articleData: TransferArticleDto) {
    const article = await this.articleModel
      .findByIdAndUpdate(
        { _id: id },
        { ...articleData, transferedAt: new Date() },
        { new: true },
      )
      .populate([{ path: "createdBy", model: "Profile" }]);
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }
}

export default ArticleService;
