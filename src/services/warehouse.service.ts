import { CreateWarehouseDto } from "core/dtos";
import { Model } from "mongoose";
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  WarehouseDto,
} from "../core/dtos";
import { Warehouse, WarehouseDocument } from "models";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
class WarehouseService {
  constructor(
    @InjectModel(Warehouse.name)
    private warehouseModel: Model<WarehouseDocument>,
  ) {}

  /**
   * Create a profile with Create fields
   * @param {Create} payload profile payload
   * @returns {Promise<Profile>} created profile data
   */
  async create(payload: CreateWarehouseDto) {
    const createdWarehouse = await this.warehouseModel.create(payload);

    return createdWarehouse;
  }

  async get(pageOptionsDto: PageOptionsDto): Promise<PageDto<WarehouseDto>> {
    console.log({ pageOptionsDto });

    const PAGE_SIZE = 50;
    const name = pageOptionsDto.searchQuery || ".";
    const page = pageOptionsDto.offset;
    const skip = (page - 1) * PAGE_SIZE;
    let entities = await this.warehouseModel
      .find({
        name: { $regex: new RegExp(name, "i") },
      })
      .sort({ name: 1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .populate([{ path: "createdBy", model: "Profile" }]);

    let itemCount = await this.warehouseModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}

export default WarehouseService;
