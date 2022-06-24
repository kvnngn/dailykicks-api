import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import headers from "fastify-helmet";
import fastifyRateLimiter from "fastify-rate-limit";
import * as fs from "fs";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "app.module";

/**
 * The url endpoint for open api ui
 * @type {string}
 */
export const SWAGGER_API_ROOT = "api/docs";
/**
 * The name of the api
 * @type {string}
 */
export const SWAGGER_API_NAME = "API";
/**
 * A short description of the api
 * @type {string}
 */
export const SWAGGER_API_DESCRIPTION = "API Description";
/**
 * Current version of the api
 * @type {string}
 */
export const SWAGGER_API_CURRENT_VERSION = "1.0";

(async () => {
  const httpsOptions = {
    key: fs.readFileSync("./certs/privkey.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  };
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, https: httpsOptions }),
  );
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
  app.enableCors();
  app.register(headers);
  app.register(fastifyRateLimiter, {
    max: 100,
    timeWindow: 60000,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(443, "0.0.0.0");
})();
