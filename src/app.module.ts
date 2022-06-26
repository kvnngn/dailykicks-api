import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import * as winston from "winston";
import * as rotateFile from "winston-daily-rotate-file";
import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AccessControlModule } from "nest-access-control";
import { roles } from "./app.roles";
import {
  AppController,
  AuthController,
  ProfileController,
  WarehouseController,
} from "controllers";
import { Profile, Warehouse } from "core/entities";
import {
  Brand,
  BrandModel,
  BrandModelSchema,
  BrandSchema,
  Product,
  ProductSchema,
  ProfileSchema,
  WarehouseSchema,
} from "models";
import { AuthModule } from "modules/auth.module";
import { ConfigModule } from "modules/config.module";
import { ConfigService } from "services/config.service";
import { WinstonModule } from "utils/winston/winston.module";
import ProfileModule from "modules/profile.module";
import WarehouseModule from "modules/warehouse.module";
import ProductModule from "./modules/product.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Warehouse.name, schema: WarehouseSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: BrandModel.name, schema: BrandModelSchema },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          uri: configService.get("DB_URL"),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as MongooseModuleAsyncOptions),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.isEnv("dev")
          ? {
              level: "info",
              format: winston.format.json(),
              defaultMeta: { service: "user-service" },
              transports: [
                new winston.transports.Console({
                  format: winston.format.simple(),
                }),
              ],
            }
          : {
              level: "info",
              format: winston.format.json(),
              defaultMeta: { service: "user-service" },
              transports: [
                new winston.transports.File({
                  filename: "logs/error.log",
                  level: "error",
                }),
                new winston.transports.Console({
                  format: winston.format.simple(),
                }),
                new rotateFile({
                  filename: "logs/application-%DATE%.log",
                  datePattern: "YYYY-MM-DD",
                  zippedArchive: true,
                  maxSize: "20m",
                  maxFiles: "14d",
                }),
              ],
            };
      },
    }),
    AccessControlModule.forRoles(roles),
    ConfigModule,
    AuthModule,
    ProfileModule,
    WarehouseModule,
    ProductModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
