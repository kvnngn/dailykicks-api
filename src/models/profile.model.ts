import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
