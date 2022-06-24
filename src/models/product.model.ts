import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Brand } from "./brandModel.model";
import { BrandModel } from "./model.model";
import { Profile } from "./profile.model";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  image_urls: string[];

  @Prop()
  colors: string[];

  @Prop()
  price: number;

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
    ref: "Model",
    required: true,
  })
  model: BrandModel;

  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
