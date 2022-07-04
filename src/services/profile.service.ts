import { Model, Types } from "mongoose";
import {
  CreateProfileDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  ProfileDto,
  UpdateProfileDto,
} from "../core/dtos";
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
  async createAdmin(payload: CreateProfileDto) {
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

  async createUser(payload: CreateProfileDto) {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException(
        "The account with the provided email currently exists. Please choose another one.",
      );
    }
    const createdProfile = await this.profileModel.create({
      ...payload,
      store: payload.store,
      password: crypto.createHmac("sha256", payload.password).digest("hex"),
      avatar: gravatar.url(payload.email, {
        protocol: "http",
        s: "200",
        r: "pg",
        d: "404",
      }),
      roles: AppRoles.SELLER,
    });

    return createdProfile;
  }

  updateProfile(profileId: string, updateProfileDto: UpdateProfileDto) {
    return this.profileModel.findOneAndUpdate(
      { _id: profileId },
      {
        ...updateProfileDto,
        password: crypto
          .createHmac("sha256", updateProfileDto.password)
          .digest("hex"),
      },
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
    return this.profileModel.findOne({ email: email });
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
   * Fetches a profile from database by id
   * @param {string} id
   * @returns {Promise<Profile>} queried profile data
   */
  async getByStore(
    pageOptionsDto: PageOptionsDto,
    storeId: string,
  ): Promise<PageDto<ProfileDto>> {
    const filters = pageOptionsDto.filter;
    let pipeline = [];

    // match store and populate references
    pipeline.push({
      $match: {
        store: new Types.ObjectId(storeId),
      },
    });

    // add pagination, limit, sort
    pipeline.push(
      { $limit: Number(pageOptionsDto.limit) },
      { $skip: Number(pageOptionsDto.skip) },
    );

    // add sort
    if (pageOptionsDto.sort) {
      pipeline.push({ $sort: JSON.parse(pageOptionsDto.sort) });
    }

    let entities = await this.profileModel.aggregate(pipeline);
    let itemCount = await this.profileModel.countDocuments();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Fetches a profile by their email and hashed password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Profile>} queried profile data
   */
  getByEmailAndPass(email: string, password: string) {
    return this.profileModel.findOne({
      email,
      password: crypto.createHmac("sha256", password).digest("hex"),
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

  async delete(id: string) {
    const profile = await this.profileModel.remove({ _id: id });
    return profile;
  }
}

export default ProfileService;
