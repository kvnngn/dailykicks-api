import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Profile } from "./profile.model";

export type WarehouseDocument = Warehouse & Document;

@Schema()
export class Warehouse {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  })
  createdBy: Profile;

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
