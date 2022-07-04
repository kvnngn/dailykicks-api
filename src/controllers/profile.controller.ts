import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import ProfileService from "services/profile.service";
import {
  PageOptionsDto,
  PageDto,
  ProfileDto,
  UpdateProfileDto,
  CreateProfileDto,
} from "../core/dtos";
import { UseRoles } from "nest-access-control";

/**
 * Profile Controller
 */
@ApiBearerAuth()
@ApiTags("profile")
@Controller("api/profile")
export class ProfileController {
  /**
   * Constructor
   * @param profileService
   */
  constructor(private profileService: ProfileService) {}

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
    const profile = await this.profileService.getByEmail(email);
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
    const profile = await this.profileService.getById(id);
    console.log({ profile });
    if (!profile) {
      throw new BadRequestException(
        "The profile with that id could not be found.",
      );
    }
    return profile;
  }

  /**
   * Retrieves a particular profile
   * @param id the profile given id to fetch
   * @returns {Promise<IProfile>} queried profile data
   */
  @Get("/store/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Profile Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Profile Request Failed" })
  async getUserByStore(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") storeId: string,
  ): Promise<PageDto<ProfileDto>> {
    console.log(pageOptionsDto);
    console.log(storeId);
    return await this.profileService.getByStore(pageOptionsDto, storeId);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateProfileDto} payload the registration dto
   */
  @Post()
  @ApiResponse({ status: 200, description: "Profile Creation Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async add(@Body() payload: CreateProfileDto): Promise<ProfileDto> {
    return this.profileService.createUser(payload);
  }

  /**
   * Edit a Profile
   * @param {UpdateProfileDto} payload
   * @returns {Promise<Profile>} mutated Profile data
   */
  @Put("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Put Profile Request Received" })
  @ApiResponse({ status: 400, description: "Put Profile Request Failed" })
  async update(@Param("id") id: string, @Body() payload: UpdateProfileDto) {
    return await this.profileService.updateProfile(id, payload);
  }

  /**
   * Removes a profile from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the profile has been deleted
   */
  @Delete("/id/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({
    status: 200,
    description: "Delete profile Request Received",
  })
  @ApiResponse({ status: 400, description: "Delete profile Request Failed" })
  async delete(@Param("id") id: string) {
    return await this.profileService.delete(id);
  }
}
