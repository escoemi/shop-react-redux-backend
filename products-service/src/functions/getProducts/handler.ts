import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getAllProducts } from "src/services/ProductService";

import schema from "./schema";

export const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    console.log(`getProducts has started with the arguments.`)
    const products = await getAllProducts();
    return formatJSONResponse({
      successful: true,
      data: products,
    }, 200);
  } catch (e) {
    return formatJSONResponse({
      successful: false,
      message: e.message || `Unexpected error happened trying to get all the products`,
    }, e.status);
  }
};

export const main = middyfy(getProducts);
