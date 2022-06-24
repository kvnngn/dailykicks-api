import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "controllers";
import {
  Brand,
  BrandModel,
  BrandModelSchema,
  BrandSchema,
  Product,
  ProductSchema,
} from "models";
import BrandService from "../services/brand.service";
import BrandModelService from "../services/brandModel.service";
import ProductService from "../services/product.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    MongooseModule.forFeature([
      { name: BrandModel.name, schema: BrandModelSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, BrandService, BrandModelService],
  exports: [ProductService, BrandService, BrandModelService],
})
class ProductModule {}

export default ProductModule;
