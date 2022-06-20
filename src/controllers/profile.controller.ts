import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import ProfileService from "services/profile.service";

/**
 * Profile Controller
 */
@ApiBearerAuth()
@ApiTags("profile")
@Controller("api/profile")
export class ProfileController {
  /**
   * Constructor
   * @param ProfileService
   */
  constructor(private ProfileService: ProfileService) {}

  /**
   * Retrieves a particular profile
   * @param username the profile given username to fetch
   * @returns {Promise<IProfile>} queried profile data
   */
  @Get("/email/:email")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Profile Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Profile Request Failed" })
  async getProfileByEmail(@Param("email") email: string) {
    const profile = await this.ProfileService.getByEmail(email);
    if (!profile) {
      throw new BadRequestException(
        "The profile with that username could not be found.",
      );
    }
    return profile;
  }

  /**
   * Retrieves a particular profile
   * @param username the profile given username to fetch
   * @returns {Promise<IProfile>} queried profile data
   */
  @Get("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Profile Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Profile Request Failed" })
  async getProfileById(@Param("id") id: string) {
    const profile = await this.ProfileService.getById(id);
    if (!profile) {
      throw new BadRequestException(
        "The profile with that id could not be found.",
      );
    }
    return profile;
  }

  // /**
  //  * Edit a profile
  //  * @param {RegisterPayload} payload
  //  * @returns {Promise<IProfile>} mutated profile data
  //  */
  // @Patch()
  // @UseGuards(AuthGuard("jwt"))
  // @UseRoles({
  //   resource: "profiles",
  //   action: "update",
  //   possession: "any",
  // })
  // @ApiResponse({ status: 200, description: "Patch Profile Request Received" })
  // @ApiResponse({ status: 400, description: "Patch Profile Request Failed" })
  // async patchProfile(@Body() payload: PatchProfilePayload) {
  //   return await this.ProfileService.edit(payload);
  // }

  // /**
  //  * Removes a profile from the database
  //  * @param {string} username the username to remove
  //  * @returns {Promise<IGenericMessageBody>} whether or not the profile has been deleted
  //  */
  // @Delete(":username")
  // @UseGuards(AuthGuard("jwt"), ACGuard)
  // @UseRoles({
  //   resource: "profiles",
  //   action: "delete",
  //   possession: "any",
  // })
  // @ApiResponse({ status: 200, description: "Delete Profile Request Received" })
  // @ApiResponse({ status: 400, description: "Delete Profile Request Failed" })
  // async delete(
  //   @Param("username") username: string,
  // ): Promise<IGenericMessageBody> {
  //   return await this.ProfileService.delete(username);
  // }
}
