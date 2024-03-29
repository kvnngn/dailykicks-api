import {
  RevertSellArticleDto,
  TransferArticleToWarehouseDto,
} from "./../core/dtos/article.dto";
import {
  CreateArticleDto,
  SellArticleDto,
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
import { buildRegexQuery } from "utils/filters/regex";

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
  async create(payload) {
    let createdArticle = await this.articleModel.create({
      ...payload,
    });

    return createdArticle;
  }

  async get(
    pageOptionsDto: PageOptionsDto,
    warehouseId: string,
  ): Promise<PageDto<ArticleDto>> {
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
      if (parsedFilter.size) {
        pipeline.push({
          $match: { size: parseInt(parsedFilter.size) },
        });
      }
      if (parsedFilter.transferedAt && parsedFilter.transferedAt === "yes") {
        pipeline.push({
          $match: { transferedAt: null },
        });
      }
      if (parsedFilter.soldAt && parsedFilter.soldAt === "yes") {
        pipeline.push({
          $match: { soldAt: null },
        });
      }
    }

    // add pagination, limit, sort
    pipeline.push(
      { $limit: Number(pageOptionsDto.limit) + Number(pageOptionsDto.skip) },
      { $skip: Number(pageOptionsDto.skip) },
    );

    // add sort
    if (pageOptionsDto.sort) {
      pipeline.push({ $sort: JSON.parse(pageOptionsDto.sort) });
    }

    let entities = await this.articleModel.aggregate(pipeline);
    let itemCount = await this.articleModel.countDocuments({
      $or: [
        { warehouse: new Types.ObjectId(warehouseId) },
        { store: new Types.ObjectId(warehouseId) },
      ],
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getWarehouseInventory(
    pageOptionsDto: PageOptionsDto,
    warehouseId: string,
  ): Promise<PageDto<ArticleDto>> {
    const { sku } = JSON.parse(pageOptionsDto.filter || "{}");
    let pipeline = [];

    // match warehouse and populate references
    pipeline.push(
      {
        $match: {
          warehouse: new Types.ObjectId(warehouseId),
        },
      },
      {
        $group: {
          _id: "$product",
          total: {
            $sum: {
              $cond: [
                {
                  $eq: ["$transferedAt", null],
                },
                1,
                0,
              ],
            },
          },
          sizes: {
            $push: {
              $cond: [
                {
                  $eq: ["$transferedAt", null],
                },
                "$size",
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
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
    );

    // add pagination, limit, sort
    pipeline.push(
      { $limit: Number(pageOptionsDto.limit) + Number(pageOptionsDto.skip) },
      { $skip: Number(pageOptionsDto.skip) },
      { $sort: { total: 1 } },
    );

    if (sku) {
      pipeline.push({
        $match: {
          "product.sku": buildRegexQuery(sku),
        },
      });
    }

    // add sort
    if (pageOptionsDto.sort) {
      pipeline.push({ $sort: JSON.parse(pageOptionsDto.sort) });
    }

    console.log({ pipeline });

    let entities = await this.articleModel.aggregate(pipeline);
    let itemCount = await this.articleModel.aggregate([
      {
        $match: {
          warehouse: new Types.ObjectId(warehouseId),
        },
      },
      {
        $group: { _id: null, uniqueValues: { $addToSet: "$product" } },
      },
    ]);
    const pageMetaDto = new PageMetaDto({
      itemCount: itemCount.length ? itemCount[0].uniqueValues.length : 0,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async getStoreInventory(
    pageOptionsDto: PageOptionsDto,
    storeId: string,
  ): Promise<PageDto<ArticleDto>> {
    const { sku } = JSON.parse(pageOptionsDto.filter || "{}");
    let pipeline = [];

    // match warehouse and populate references
    pipeline.push(
      {
        $match: {
          store: new Types.ObjectId(storeId),
        },
      },
      {
        $group: {
          _id: "$product",
          total: {
            $sum: {
              $cond: [
                {
                  $eq: ["$soldAt", null],
                },
                1,
                0,
              ],
            },
          },
          sizes: {
            $push: {
              $cond: [
                {
                  $eq: ["$soldAt", null],
                },
                "$size",
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
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
    );

    if (sku) {
      pipeline.push({
        $match: {
          "product.sku": buildRegexQuery(sku),
        },
      });
    }

    // add pagination, limit, sort
    pipeline.push(
      { $limit: Number(pageOptionsDto.limit) + Number(pageOptionsDto.skip) },
      { $skip: Number(pageOptionsDto.skip) },
      { $sort: { total: 1 } },
    );

    // add sort
    if (pageOptionsDto.sort) {
      pipeline.push({ $sort: JSON.parse(pageOptionsDto.sort) });
    }

    let entities = await this.articleModel.aggregate(pipeline);
    let itemCount = await this.articleModel.aggregate([
      {
        $match: {
          store: new Types.ObjectId(storeId),
        },
      },
      {
        $group: { _id: null, uniqueValues: { $addToSet: "$product" } },
      },
    ]);
    const pageMetaDto = new PageMetaDto({
      itemCount: itemCount.length ? itemCount[0].uniqueValues.length : 0,
      pageOptionsDto,
    });
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

  /**
   * Fetches a warehouse from database by productId
   * @param {string} id
   * @returns {Promise<Article[]>} queried warehouse data
   */
  getByProductId(productId: string) {
    return this.articleModel
      .find({
        product: productId,
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

  async transferToWarehouse(
    id: string,
    articleData: TransferArticleToWarehouseDto,
  ) {
    const article = await this.articleModel
      .findByIdAndUpdate(
        { _id: id },
        { ...articleData, store: null, transferedAt: null },
        { new: true },
      )
      .populate([{ path: "createdBy", model: "Profile" }]);
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  async transferToStore(id: string, articleData: TransferArticleDto) {
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

  async sell(id: string, articleData: SellArticleDto) {
    const article = await this.articleModel
      .findByIdAndUpdate(
        { _id: id },
        { ...articleData, soldAt: new Date() },
        { new: true },
      )
      .populate([{ path: "createdBy", model: "Profile" }]);
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  async revertSell(id: string, articleData: RevertSellArticleDto) {
    const article = await this.articleModel
      .findByIdAndUpdate(
        { _id: id },
        { soldAt: null, updatedBy: articleData.updatedBy },
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
