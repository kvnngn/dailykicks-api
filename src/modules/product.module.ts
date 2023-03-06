import { ConfigModule } from "modules/config.module";
import { ConfigService } from "services/config.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "controllers";
import {
  Article,
  ArticleSchema,
  Brand,
  BrandModel,
  BrandModelSchema,
  BrandSchema,
  Product,
  ProductSchema,
} from "models";
import { FilesService } from "../services/files.service";
import ProductService from "../services/product.service";
import ArticleService from "services/article.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: BrandModel.name, schema: BrandModelSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
    ConfigModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, FilesService, ArticleService],
  exports: [ProductService, FilesService],
})
class ProductModule {}

export default ProductModule;
