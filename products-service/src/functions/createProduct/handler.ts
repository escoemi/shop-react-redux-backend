import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Product } from "src/entities/Product";
import { createProduct as addProduct } from "src/services/ProductService";

import schema from "./schema";

export const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const newProduct: Omit<Product, "id"> = {
      title: event.body.title as string,
      description: event.body.description as string,
      count: +event.body.count as number,
      price: +event.body.price as number,
    };
    console.log(`createProduct has started with the arguments.`);
    console.log(
      `title: ${newProduct.title}, description: ${newProduct.description}, count: ${newProduct.count}, price: ${newProduct.price}`
    );
    const product = await addProduct(newProduct);
    return formatJSONResponse({
      successful: true,
      data: product,
    }, 201);
  } catch (e) {
    return formatJSONResponse({
      successful: false,
      message:
        e.message || `Unexpected error happened trying to add the products`,
    }, e.status);
  }
};

export const main = middyfy(createProduct);
