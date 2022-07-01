import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WarehouseController } from "controllers";
import { Article, ArticleSchema, Warehouse, WarehouseSchema } from "models";
import WarehouseService from "services/warehouse.service";
import ArticleService from "../services/article.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Warehouse.name, schema: WarehouseSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService, ArticleService],
  exports: [WarehouseService],
})
class WarehouseModule {}

export default WarehouseModule;
