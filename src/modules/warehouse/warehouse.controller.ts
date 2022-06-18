import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WarehouseService, IGenericMessageBody } from "./warehouse.service";
import { PatchWarehousePayload } from "./payload/patch.warehouse.payload";
import { IWarehouse } from "models/warehouse.model";

/**
 * Warehouse Controller
 */
@ApiBearerAuth()
@ApiTags("warehouse")
@Controller("api/warehouse")
export class WarehouseController {
  /**
   * Constructor
   * @param warehouseService
   */
  constructor(private readonly warehouseService: WarehouseService) {}

  /**
   * Retrieves a particular warehouse
   * @param username the warehouse given username to fetch
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  @Get("/email/:email")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Warehouse Request Failed" })
  async getWarehouseByEmail(
    @Param("email") email: string,
  ): Promise<IWarehouse> {
    const warehouse = await this.warehouseService.getByEmail(email);
    if (!warehouse) {
      throw new BadRequestException(
        "The warehouse with that username could not be found.",
      );
    }
    return warehouse;
  }

  /**
   * Retrieves a particular warehouse
   * @param username the warehouse given username to fetch
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Warehouse Request Failed" })
  async getPaginatedWarehouse(
    @Param("page") page: number,
    @Param("pageSize") pageSize: number,
  ): Promise<IWarehouse[]> {
    console.log(page, pageSize);
    const warehouse = await this.warehouseService.get(page, pageSize);
    if (!warehouse) {
      throw new BadRequestException(
        "The warehouse with that username could not be found.",
      );
    }
    return warehouse;
  }

  /**
   * Retrieves a particular warehouse
   * @param username the warehouse given username to fetch
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  @Get("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Warehouse Request Failed" })
  async getWarehouseById(@Param("id") id: string): Promise<IWarehouse> {
    const warehouse = await this.warehouseService.getById(id);
    if (!warehouse) {
      throw new BadRequestException(
        "The warehouse with that id could not be found.",
      );
    }
    return warehouse;
  }

  /**
   * Edit a warehouse
   * @param {RegisterPayload} payload
   * @returns {Promise<IWarehouse>} mutated warehouse data
   */
  @Patch()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "warehouses",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Patch Warehouse Request Failed" })
  async patchWarehouse(@Body() payload: PatchWarehousePayload) {
    return await this.warehouseService.edit(payload);
  }

  /**
   * Removes a warehouse from the database
   * @param {string} username the username to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the warehouse has been deleted
   */
  @Delete(":username")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "warehouses",
    action: "delete",
    possession: "any",
  })
  @ApiResponse({
    status: 200,
    description: "Delete Warehouse Request Received",
  })
  @ApiResponse({ status: 400, description: "Delete Warehouse Request Failed" })
  async delete(
    @Param("username") username: string,
  ): Promise<IGenericMessageBody> {
    return await this.warehouseService.delete(username);
  }
}
