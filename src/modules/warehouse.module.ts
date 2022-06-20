import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WarehouseController } from "controllers";
import { Warehouse, WarehouseSchema } from "models";
import WarehouseService from "services/warehouse.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
class WarehouseModule {}

export default WarehouseModule;
