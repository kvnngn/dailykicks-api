import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Store } from "./store.model";

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  roles: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: false,
    default: null,
  })
  store: Store;

  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
