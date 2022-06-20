import { AuthController } from "controllers/auth.controller";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "./config.module";
import { ConfigService } from "../services/config.service";
import { AuthService } from "../services/auth.service";
import { JwtStrategy } from "../utils/jwt.strategy";
import ProfileModule from "./profile.module";

@Module({
  imports: [
    ProfileModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get("WEBTOKEN_SECRET_KEY"),
          signOptions: {
            ...(configService.get("WEBTOKEN_EXPIRATION_TIME")
              ? {
                  expiresIn: Number(
                    configService.get("WEBTOKEN_EXPIRATION_TIME"),
                  ),
                }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: "jwt" })],
})
export class AuthModule {}
