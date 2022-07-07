import { IsString } from "class-validator";
import { CreateProductDto, UpdateProductDto } from "core/dtos";
import { Model } from "mongoose";
import { PageDto, PageMetaDto, PageOptionsDto, ProductDto } from "../core/dtos";
import {
  Brand,
  BrandDocument,
  BrandModel,
  BrandModelDocument,
  Product,
  ProductDocument,
} from "models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilesService } from "./files.service";
import _ from "lodash";

@Injectable()
class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
    @InjectModel(BrandModel.name)
    private brandModelModel: Model<BrandModelDocument>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Create a warehouse with Create fields
   * @param {Create} payload warehouse payload
   * @returns {Promise<Product>} created warehouse data
   */
  async create(payload: CreateProductDto, file: Express.Multer.File) {
    const storedFile = await this.filesService.uploadPublicFile(
      file.buffer,
      `${file.originalname}`,
    );
    console.log({ storedFile });
    let brand = await this.brandModel.findOne({
      name: payload.brand,
    });
    if (!brand) {
      brand = await this.brandModel.create({
        name: payload.brand,
        createdBy: payload.createdBy,
      });
    }
    let brandModel = await this.brandModelModel.findOne({
      name: payload.brandModel,
      brand,
    });
    if (!brandModel) {
      brandModel = await this.brandModelModel.create({
        name: payload.brandModel,
        createdBy: payload.createdBy,
        brand,
      });
    }
    let createdProduct = await this.productModel.create({
      ...payload,
      brand: brand._id,
      brandModel: brandModel._id,
      name: `${brand.name} - ${brandModel.name}`,
      image_url: storedFile.url,
    });

    return createdProduct;
  }

  async get(pageOptionsDto: PageOptionsDto): Promise<PageDto<ProductDto>> {
    console.log({ pageOptionsDto });

    const PAGE_SIZE = pageOptionsDto.limit;
    const name = pageOptionsDto.searchQuery || ".";

    let entities = await this.productModel
      .find({
        name: { $regex: new RegExp(name, "i") },
      })
      .sort(pageOptionsDto.sort)
      .skip(pageOptionsDto.skip)
      .limit(PAGE_SIZE)
      .populate([
        { path: "createdBy", model: "Profile" },
        { path: "brand", model: "Brand" },
        { path: "brandModel", model: "BrandModel" },
      ]);
    let itemCount = await this.productModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Fetches a warehouse from database by id
   * @param {string} id
   * @returns {Promise<Product>} queried warehouse data
   */
  getById(id: string) {
    return this.productModel
      .findOne({
        _id: id,
      })
      .populate([
        { path: "createdBy", model: "Profile" },
        { path: "brand", model: "Brand" },
        { path: "brandModel", model: "BrandModel" },
      ]);
  }

  /**
   * Fetches brands
   * @returns {Promise<Brand>} queried Brand data
   */
  getBrands() {
    return this.brandModel.find();
  }

  /**
   * Fetches brands
   * @returns {Promise<BrandModel>} queried BrandModel data
   */
  getBrandModels() {
    return this.brandModelModel.find();
  }

  async update(
    id: string,
    productData: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    let storedFile = null;
    if (file && typeof file === "object" && file.buffer) {
      storedFile = await this.filesService.uploadPublicFile(
        file.buffer,
        `${file.originalname}`,
      );
    } else {
      storedFile = productData.image_url;
    }
    let brand = await this.brandModel.findOne({
      name: productData.brand,
    });
    if (!brand) {
      brand = await this.brandModel.create({
        name: productData.brand,
      });
    }
    let brandModel = await this.brandModelModel.findOne({
      name: productData.brandModel,
    });
    if (!brandModel) {
      brandModel = await this.brandModelModel.create({
        name: productData.brandModel,
        createdBy: productData.createdBy,
        brand,
      });
    }

    const product = await this.productModel
      .findByIdAndUpdate(
        { _id: id },
        {
          brand: brand._id,
          brandModel: brandModel._id,
          image_url: storedFile
            ? typeof storedFile === "object"
              ? storedFile.url
              : storedFile
            : null,
          name: `${brand.name} - ${brandModel.name}`,
          sku: productData.sku,
        },
        { new: true },
      )
      .populate([{ path: "createdBy", model: "Profile" }]);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async delete(id: string) {
    const warehouse = await this.productModel.remove({ _id: id });
    return warehouse;
  }
}

export default ProductService;
