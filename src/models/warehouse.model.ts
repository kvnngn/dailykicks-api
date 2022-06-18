import { Schema, Document } from "mongoose";

export const Warehouse = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedBy: { type: Schema.Types.ObjectId, required: true },
  lastUpdated: {
    type: Date,
  },
});

export interface IWarehouse extends Document {
  readonly _id: Schema.Types.ObjectId;
  readonly name: string;
  readonly createdAt: Date;
  readonly createdBy: string;
  readonly lastUpdated: Date;
  readonly lastUpdatedBy: string;
}
