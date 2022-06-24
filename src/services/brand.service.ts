import { BrandDto } from "./../core/dtos/brand.dto";
import { Model } from "mongoose";
import { Brand, BrandDocument } from "models";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
  ) {}

  /**
   * Create a brand with Create fields
   * @param {Create} payload brand payload
   * @returns {Promise<Brand>} created brand data
   */
  async create(payload: BrandDto) {
    const createdBrand = await this.brandModel.create(payload);

    return createdBrand;
  }
}

export default BrandService;
