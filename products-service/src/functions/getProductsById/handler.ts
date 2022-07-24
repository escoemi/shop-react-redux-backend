import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getProductById } from "src/services/ProductService";

import schema from "./schema";

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { id: productId = "" } = event.pathParameters;
  if (!productId) {
    return formatJSONResponse(
      {
        successful: false,
        message: `Request should have the id`,
      },
      403
    );
  }
  const product = await getProductById(productId);
  if (!product) {
    return formatJSONResponse(
      {
        successful: false,
        message: `Product with the id ${productId} not found`,
      },
      404
    );
  }
  return formatJSONResponse({
    successful: true,
    data: product,
  });
};

export const main = middyfy(getProductsById);
