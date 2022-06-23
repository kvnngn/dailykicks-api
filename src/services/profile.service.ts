import { Model } from "mongoose";
import { CreateProfileDto, UpdateProfileDto } from "../core/dtos";
import { AppRoles } from "app.roles";
import * as crypto from "crypto";
import * as gravatar from "gravatar";
import { Profile, ProfileDocument } from "models";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  /**
   * Create a profile with CreateProfileDto fields
   * @param {CreateProfileDto} payload profile payload
   * @returns {Promise<Profile>} created profile data
   */
  async create(payload: CreateProfileDto) {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException(
        "The account with the provided email currently exists. Please choose another one.",
      );
    }
    const createdProfile = await this.profileModel.create({
      ...payload,
      password: crypto.createHmac("sha256", payload.password).digest("hex"),
      avatar: gravatar.url(payload.email, {
        protocol: "http",
        s: "200",
        r: "pg",
        d: "404",
      }),
      roles: AppRoles.ADMIN,
    });

    return createdProfile;
  }

  updateProfile(profileId: string, updateProfileDto: UpdateProfileDto) {
    return this.profileModel.findOneAndUpdate(
      { _id: profileId },
      updateProfileDto,
    );
  }

  /**
   * Fetches a profile from database by UUID
   * @param {string} id
   * @returns {Promise<Profile>} queried profile data
   */
  get(id: string) {
    return this.profileModel.findById(id);
  }

  /**
   * Fetches a profile from database by email
   * @param {string} email
   * @returns {Promise<Profile>} queried profile data
   */
  getByEmail(email: string) {
    return this.profileModel.findOne({
      where: {
        email: { $eq: email },
      },
    });
  }

  /**
   * Fetches a profile from database by id
   * @param {string} id
   * @returns {Promise<Profile>} queried profile data
   */
  getById(id: string) {
    return this.profileModel.findOne({
      _id: id,
    });
  }

  /**
   * Fetches a profile by their username and hashed password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Profile>} queried profile data
   */
  getByUsernameAndPass(username: string, password: string) {
    return this.profileModel.findOne({
      where: {
        username: { $eq: username },
        password: crypto.createHmac("sha256", password).digest("hex"),
      },
    });
  }

  /**
   * Edit profile data
   * @param {PatchProfilePayload} payload
   * @returns {Promise<Profile>} mutated profile data
   */
  async edit(profileId: string, updateProfileDto: UpdateProfileDto) {
    return this.profileModel.findOneAndUpdate(
      { _id: profileId },
      updateProfileDto,
    );
  }
}

export default ProfileService;
