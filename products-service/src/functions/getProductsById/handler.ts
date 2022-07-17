import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAllProducts, getProductById } from 'src/services/ProductService';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id:productId= "" } = event.pathParameters
  if(!productId){
    return formatJSONResponse({
      successful: false,
      message: `Request should have the id`,
    });
  }
  const product=await getProductById(productId);
  if(!product){
    return formatJSONResponse({
      successful: false,
      message: `Product with the id ${productId} not found`,
    });
  }
  return formatJSONResponse({
    successful: true,
    data:product,
  });
};

export const main = middyfy(getProductsById);
