import * as crypto from "crypto";
import * as gravatar from "gravatar";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { RegisterPayload } from "modules/auth/payload/register.payload";
import { AppRoles } from "../app/app.roles";
import { PatchWarehousePayload } from "./payload/patch.warehouse.payload";
import { IWarehouse } from "models/warehouse.model";

/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

/**
 * Warehouse Service
 */
@Injectable()
export class WarehouseService {
  /**
   * Constructor
   * @param {Model<IWarehouse>} warehouseModel
   */
  constructor(
    @InjectModel("Warehouse")
    private readonly warehouseModel: Model<IWarehouse>,
  ) {}

  /**
   * Fetches a warehouse from database by email
   * @param {number} page
   * @param {number} pageSize
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  async get(page: number = 1, pageSize: number = 10): Promise<IWarehouse[]> {
    console.log({ page });
    if (page) {
      const PAGE_SIZE = 50;
      const skip = (page - 1) * PAGE_SIZE;
      return this.warehouseModel
        .find()
        .sort({ name: 1 })
        .skip(skip)
        .limit(PAGE_SIZE);
      // let total = await this.warehouseModel.countDocuments();
    } else {
      return this.warehouseModel.find().sort({ name: 1 });
    }
  }

  /**
   * Fetches a warehouse from database by email
   * @param {string} email
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  getByEmail(email: string): Promise<IWarehouse> {
    return this.warehouseModel.findOne({ email }).exec();
  }

  /**
   * Fetches a warehouse from database by id
   * @param {string} id
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  getById(id: string): Promise<IWarehouse> {
    return this.warehouseModel.findOne({ id }).exec();
  }

  /**
   * Fetches a warehouse by their username and hashed password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<IWarehouse>} queried warehouse data
   */
  getByUsernameAndPass(
    username: string,
    password: string,
  ): Promise<IWarehouse> {
    return this.warehouseModel
      .findOne({
        username,
        password: crypto.createHmac("sha256", password).digest("hex"),
      })
      .exec();
  }

  /**
   * Create a warehouse with RegisterPayload fields
   * @param {RegisterPayload} payload warehouse payload
   * @returns {Promise<IWarehouse>} created warehouse data
   */
  async create(payload: RegisterPayload): Promise<IWarehouse> {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException(
        "The account with the provided email currently exists. Please choose another one.",
      );
    }
    // this will auto assign the admin role to each created user
    const createdWarehouse = new this.warehouseModel({
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

    return createdWarehouse.save();
  }

  /**
   * Edit warehouse data
   * @param {PatchWarehousePayload} payload
   * @returns {Promise<IWarehouse>} mutated warehouse data
   */
  async edit(payload: PatchWarehousePayload): Promise<IWarehouse> {
    const { name } = payload;
    const updatedWarehouse = await this.warehouseModel.updateOne(
      { name },
      payload,
    );
    if (updatedWarehouse.modifiedCount !== 1) {
      throw new BadRequestException(
        "The warehouse with that username does not exist in the system. Please try another username.",
      );
    }
    return this.getByEmail(name);
  }

  /**
   * Delete warehouse given a username
   * @param {string} username
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  delete(username: string): Promise<IGenericMessageBody> {
    return this.warehouseModel.deleteOne({ username }).then((warehouse) => {
      if (warehouse.deletedCount === 1) {
        return { message: `Deleted ${username} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a warehouse by the name of ${username}.`,
        );
      }
    });
  }
}
