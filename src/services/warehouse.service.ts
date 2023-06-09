import { CreateWarehouseDto, UpdateWarehouseDto } from "core/dtos";
import { Model } from "mongoose";
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  WarehouseDto,
} from "../core/dtos";
import { Warehouse, WarehouseDocument } from "models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
class WarehouseService {
  constructor(
    @InjectModel(Warehouse.name)
    private warehouseModel: Model<WarehouseDocument>,
  ) {}

  /**
   * Create a warehouse with Create fields
   * @param {Create} payload warehouse payload
   * @returns {Promise<Warehouse>} created warehouse data
   */
  async create(payload: CreateWarehouseDto) {
    const createdWarehouse = await this.warehouseModel.create(payload);

    return createdWarehouse;
  }

  async get(pageOptionsDto: PageOptionsDto): Promise<PageDto<WarehouseDto>> {
    const PAGE_SIZE = pageOptionsDto.limit;
    const name = pageOptionsDto.searchQuery || ".";

    let entities = await this.warehouseModel.aggregate([
      {
        $match: {
          name: { $regex: new RegExp(name, "i") },
        },
      },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "warehouse",
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
                  $eq: ["$$article.transferedAt", null],
                },
              },
            },
          },
        },
      },
      { $limit: Number(pageOptionsDto.limit) + Number(pageOptionsDto.skip) },
      { $skip: Number(pageOptionsDto.skip) },
    ]);

    let itemCount = await this.warehouseModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Fetches a warehouse from database by id
   * @param {string} id
   * @returns {Promise<Warehouse>} queried warehouse data
   */
  getById(id: string) {
    return this.warehouseModel.findOne({
      _id: id,
    });
  }

  async update(id: string, warehouseData: UpdateWarehouseDto) {
    const warehouse = await this.warehouseModel
      .findByIdAndUpdate({ _id: id }, warehouseData, { new: true })
      .populate([{ path: "createdBy", model: "Profile" }]);
    if (!warehouse) {
      throw new NotFoundException();
    }
    return warehouse;
  }

  async delete(id: string) {
    const warehouse = await this.warehouseModel.remove({ _id: id });
    return warehouse;
  }
}

export default WarehouseService;
