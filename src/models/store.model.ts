import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Profile } from "./profile.model";

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  })
  createdBy: Profile;

  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
