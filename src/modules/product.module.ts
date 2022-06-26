import { ConfigModule } from "modules/config.module";
import { ConfigService } from "services/config.service";
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
import { FilesService } from "../services/files.service";
import ProductService from "../services/product.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: BrandModel.name, schema: BrandModelSchema },
    ]),
    ConfigModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, FilesService],
  exports: [ProductService, FilesService],
})
class ProductModule {}

export default ProductModule;
