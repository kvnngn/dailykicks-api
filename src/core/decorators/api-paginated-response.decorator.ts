import { PageDto } from './../dtos/page.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { StoreDto } from 'server/modules/store/dtos';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, StoreDto),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
