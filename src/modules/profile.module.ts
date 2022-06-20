import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileController } from "controllers";
import { Profile, ProfileSchema } from "models";
import ProfileService from "services/profile.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
class ProfileModule {}

export default ProfileModule;
