import { CreateProductDto, UpdateProductDto } from "core/dtos";
import { Model } from "mongoose";
import { PageDto, PageMetaDto, PageOptionsDto, ProductDto } from "../core/dtos";
import { Product, ProductDocument } from "models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
class ProductService {
  constructor(
    @InjectModel(Product.name)
    private warehouseModel: Model<ProductDocument>,
  ) {}

  /**
   * Create a warehouse with Create fields
   * @param {Create} payload warehouse payload
   * @returns {Promise<Product>} created warehouse data
   */
  async create(payload: CreateProductDto) {
    const createdProduct = await this.warehouseModel.create(payload);

    return createdProduct;
  }

  async get(pageOptionsDto: PageOptionsDto): Promise<PageDto<ProductDto>> {
    console.log({ pageOptionsDto });

    const PAGE_SIZE = pageOptionsDto.limit;
    const name = pageOptionsDto.searchQuery || ".";

    let entities = await this.warehouseModel
      .find({
        name: { $regex: new RegExp(name, "i") },
      })
      .sort(pageOptionsDto.sort)
      .skip(pageOptionsDto.skip)
      .limit(PAGE_SIZE)
      .populate([{ path: "createdBy", model: "Profile" }]);

    let itemCount = await this.warehouseModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Fetches a warehouse from database by id
   * @param {string} id
   * @returns {Promise<Product>} queried warehouse data
   */
  getById(id: string) {
    return this.warehouseModel.findOne({
      _id: id,
    });
  }

  async update(id: string, warehouseData: UpdateProductDto) {
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

export default ProductService;
