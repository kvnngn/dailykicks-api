import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Article,
  ArticleSchema,
  Brand,
  BrandModel,
  BrandModelSchema,
  BrandSchema,
} from "models";
import { ArticleController } from "../controllers/article.controller";
import ArticleService from "../services/article.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: BrandModel.name, schema: BrandModelSchema },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
class ArticleModule {}

export default ArticleModule;
