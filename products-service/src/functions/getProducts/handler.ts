import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getAllProducts } from "src/services/ProductService";

import schema from "./schema";

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const products = await getAllProducts();
    return formatJSONResponse({
      successful: true,
      data: products,
    });
  } catch (e) {
    return formatJSONResponse({
      successful: false,
      message: `Unexpected error happen`,
    });
  }
};

export const main = middyfy(getProducts);
