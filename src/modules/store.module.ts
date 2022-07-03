import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StoreController } from "controllers";
import {
  Article,
  ArticleSchema,
  Brand,
  BrandModel,
  BrandModelSchema,
  BrandSchema,
  Store,
  StoreSchema,
} from "models";
import StoreService from "services/store.service";
import ArticleService from "../services/article.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: BrandModel.name, schema: BrandModelSchema },
    ]),
  ],
  controllers: [StoreController],
  providers: [StoreService, ArticleService],
  exports: [StoreService],
})
class StoreModule {}

export default StoreModule;
