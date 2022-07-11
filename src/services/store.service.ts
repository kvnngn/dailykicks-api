import { CreateStoreDto, UpdateStoreDto } from "core/dtos";
import { Model } from "mongoose";
import { PageDto, PageMetaDto, PageOptionsDto, StoreDto } from "../core/dtos";
import { Store, StoreDocument } from "models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
class StoreService {
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<StoreDocument>,
  ) {}

  /**
   * Create a warehouse with Create fields
   * @param {Create} payload warehouse payload
   * @returns {Promise<Store>} created warehouse data
   */
  async create(payload: CreateStoreDto) {
    const createdStore = await this.storeModel.create(payload);

    return createdStore;
  }

  async get(pageOptionsDto: PageOptionsDto): Promise<PageDto<StoreDto>> {
    const PAGE_SIZE = pageOptionsDto.limit;
    const name = pageOptionsDto.searchQuery || ".";

    let entities = await this.storeModel.aggregate([
      {
        $match: {
          name: { $regex: new RegExp(name, "i") },
        },
      },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "store",
          as: "articles",
        },
      },
      {
        $project: {
          createdAt: 1,
          createdBy: 1,
          name: 1,
          updatedAt: 1,
          articles: {
            $size: {
              $filter: {
                input: "$articles",
                as: "article",
                cond: {
                  $eq: ["$$article.soldAt", null],
                },
              },
            },
          },
        },
      },
      { $limit: Number(pageOptionsDto.limit) + Number(pageOptionsDto.skip) },
      { $skip: Number(pageOptionsDto.skip) },
    ]);

    let itemCount = await this.storeModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Fetches a warehouse from database by id
   * @param {string} id
   * @returns {Promise<Store>} queried warehouse data
   */
  getById(id: string) {
    return this.storeModel.findOne({
      _id: id,
    });
  }

  async update(id: string, warehouseData: UpdateStoreDto) {
    const warehouse = await this.storeModel
      .findByIdAndUpdate({ _id: id }, warehouseData, { new: true })
      .populate([{ path: "createdBy", model: "Profile" }]);
    if (!warehouse) {
      throw new NotFoundException();
    }
    return warehouse;
  }

  async delete(id: string) {
    const warehouse = await this.storeModel.remove({ _id: id });
    return warehouse;
  }
}

export default StoreService;
