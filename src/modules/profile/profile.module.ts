import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileController } from "./profile.controller";
import { Profile } from "models/profile.model";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Profile", schema: Profile }])],
  providers: [ProfileService],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
