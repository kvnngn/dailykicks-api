import { Product } from "./product.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Profile } from "./profile.model";
import { Warehouse } from "../core";

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  })
  createdBy: Profile;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  })
  product: Product;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  })
  warehouse: Warehouse;

  @Prop({ default: false })
  sold: boolean;

  @Prop({ default: null })
  soldAt: Date;

  @Prop({ default: null })
  transferedAt: Date;

  @Prop({ default: false })
  transfered: Boolean;

  @Prop()
  storehousePrice: number;

  @Prop()
  shopPrice: number;

  @Prop()
  size: number;

  @Prop({ unique: true })
  sku: string;

  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
