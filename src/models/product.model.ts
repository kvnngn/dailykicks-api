import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Brand } from "./brand.model";
import { BrandModel } from "./brandModel.model";
import { Profile } from "./profile.model";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  image_url: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  })
  createdBy: Profile;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  })
  brand: Brand;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "BrandModel",
    required: true,
  })
  brandModel: BrandModel;

  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
