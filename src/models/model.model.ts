import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Brand } from "./brandModel.model";
import { Profile } from "./profile.model";

export type BrandModelDocument = BrandModel & Document;

@Schema()
export class BrandModel {
  @Prop({ required: true, unique: true })
  name: string;

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

  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const BrandModelSchema = SchemaFactory.createForClass(BrandModel);
