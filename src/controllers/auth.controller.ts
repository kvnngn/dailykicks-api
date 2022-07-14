import { Controller, Body, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateProfileDto, LoginProfileDto } from "core/dtos";
import { AuthService, ITokenReturnBody } from "services/auth.service";
import ProfileService from "services/profile.service";

/**
 * Authentication Controller
 */
@Controller("api/auth")
@ApiTags("authentication")
export class AuthController {
  /**
   * Constructor
   * @param {AuthService} authService authentication service
   * @param {ProfileService} profileService profile service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Login route to validate and create tokens for users
   * @param {LoginProfileDto} payload the login dto
   */
  @Post("login")
  @ApiResponse({ status: 201, description: "Login Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async login(@Body() payload: LoginProfileDto): Promise<ITokenReturnBody> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {CreateProfileDto} payload the registration dto
   */
  @Post("register")
  @ApiResponse({ status: 201, description: "Registration Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async register(@Body() payload: CreateProfileDto): Promise<ITokenReturnBody> {
    const user = await this.profileService.createAdmin(payload);
    return await this.authService.createToken(user);
  }
}
