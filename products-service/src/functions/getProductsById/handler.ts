import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getProductById } from "src/services/ProductService";
import { NotFoundProduct, UserInputError } from "src/utils/errors";

import schema from "./schema";

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { id: productId = "" } = event.pathParameters;
    console.log(
      `getProductById has started with the arguments. ProductID: ${productId}`
    );
    if (!productId) {
      throw new UserInputError("productId");
    }
    const product = await getProductById(productId);
    if (!product) {
      throw new NotFoundProduct(productId);
    }
    return formatJSONResponse({
      successful: true,
      data: product,
    }, 200);
  } catch (e) {
    return formatJSONResponse(
      {
        successful: false,
        message:
          e.message || `Unexpected error happened trying to get the product`,
      },
      e.status
    );
  }
};

export const main = middyfy(getProductsById);
