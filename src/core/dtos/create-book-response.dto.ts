import { Warehouse } from "../entities";

export class CreateWarehouseResponseDto {
  success: boolean;
  createdWarehouse: Warehouse;
}
