import { Model } from "mongoose";
import { BrandModel, BrandModelDocument } from "models";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BrandModelDto } from "../core/dtos/brandModel.dto";

@Injectable()
class BrandModelService {
  constructor(
    @InjectModel(BrandModel.name)
    private modelModel: Model<BrandModelDocument>,
  ) {}

  /**
   * Create a model with Create fields
   * @param {Create} payload model payload
   * @returns {Promise<Model>} created model data
   */
  async create(payload: BrandModelDto) {
    const createdModel = await this.modelModel.create(payload);

    return createdModel;
  }
}

export default BrandModelService;
