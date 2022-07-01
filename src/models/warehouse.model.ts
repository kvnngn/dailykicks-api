import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Profile } from "./profile.model";

export enum WarehouseType {
  Storehouse,
  Shop,
}

export type WarehouseDocument = Warehouse & Document;

@Schema()
export class Warehouse {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: String,
    enum: WarehouseType,
    default: WarehouseType.Storehouse,
  })
  type: WarehouseType;

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

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
