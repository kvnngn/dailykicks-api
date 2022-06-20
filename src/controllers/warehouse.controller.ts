import { AuthGuard } from "@nestjs/passport";
import { Body, Controller, Post, Query, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  CreateWarehouseDto,
  PageDto,
  PageOptionsDto,
  WarehouseDto,
} from "core/dtos";
import { Warehouse } from "core/entities";
import WarehouseService from "services/warehouse.service";

/**
 * Warehouse Controller
 */
@ApiBearerAuth()
@ApiTags("warehouse")
@Controller("api/warehouse")
export class WarehouseController {
  /**
   * Constructor
   * @param WarehouseUseCases
   */
  constructor(private readonly warehouseService: WarehouseService) {}

  /**
   * Retrieves a particular warehouse
   * @param page specify the page you requested
   * @param pageSize specify the page size you requested
   * @returns {Promise<CCQueryResponse<Warehouse>>} queried warehouse data
   */
  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Warehouse Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Warehouse Request Failed" })
  async getStores(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<WarehouseDto>> {
    console.log({ pageOptionsDto });
    return await this.warehouseService.get(pageOptionsDto);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateWarehouseDto} payload the registration dto
   */
  @Post("add")
  @ApiResponse({ status: 200, description: "Warehouse Creation Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async add(@Body() payload: CreateWarehouseDto): Promise<WarehouseDto> {
    return this.warehouseService.create(payload);
  }

  // /**
  //  * Edit a warehouse
  //  * @param {PatchWarehousePayload} payload
  //  * @returns {Promise<Warehouse>} mutated warehouse data
  //  */
  // @Patch()
  // @UseGuards(AuthGuard("jwt"))
  // @UseRoles({
  //   resource: "warehouses",
  //   action: "update",
  //   possession: "any",
  // })
  // @ApiResponse({ status: 200, description: "Patch Warehouse Request Received" })
  // @ApiResponse({ status: 400, description: "Patch Warehouse Request Failed" })
  // async patchWarehouse(@Body() payload: PatchWarehousePayload) {
  //   return await this.warehouseUseCases.edit(payload);
  // }

  // /**
  //  * Removes a warehouse from the database
  //  * @param {string} username the username to remove
  //  * @returns {Promise<IGenericMessageBody>} whether or not the warehouse has been deleted
  //  */
  // @Delete(":username")
  // @UseGuards(AuthGuard("jwt"), ACGuard)
  // @UseRoles({
  //   resource: "warehouses",
  //   action: "delete",
  //   possession: "any",
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: "Delete Warehouse Request Received",
  // })
  // @ApiResponse({ status: 400, description: "Delete Warehouse Request Failed" })
  // async delete(
  //   @Param("username") username: string,
  // ): Promise<IGenericMessageBody> {
  //   return await this.warehouseUseCases.delete(username);
  // }
}
