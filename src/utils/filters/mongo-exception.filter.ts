import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { MongoError } from "mongoose/node_modules/mongodb";

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: exception.errmsg,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      default:
        throw new BadRequestException(`error ${exception.code}`);
    }
  }
}
