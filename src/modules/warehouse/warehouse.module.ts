import { Module } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { MongooseModule } from "@nestjs/mongoose";
import { WarehouseController } from "./warehouse.controller";
import { Warehouse } from "models/warehouse.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Warehouse", schema: Warehouse }]),
  ],
  providers: [WarehouseService],
  exports: [WarehouseService],
  controllers: [WarehouseController],
})
export class WarehouseModule {}
