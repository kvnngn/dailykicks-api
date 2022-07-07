import { Product } from "./product.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Profile } from "./profile.model";
import { Warehouse } from "../core";
import { Store } from "./store.model";

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
  })
  warehouse: Warehouse;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    default: null,
  })
  store: Store;

  @Prop({ default: null })
  soldAt: Date;

  @Prop({ default: null })
  transferedAt: Date;

  @Prop()
  warehousePrice: number;

  @Prop()
  transferPrice: number;

  @Prop()
  storePrice: number;

  @Prop()
  sellingPrice: number;

  @Prop()
  size: number;

  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
