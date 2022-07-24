import { closeConnection, getClient } from "src/db/client";
import {
  Product,
  ProductDTO,
  ProductStockDTO,
  StockDTO,
} from "src/entities/Product";
import { mapFromProductStockDTOtoProduct } from "src/mappers/ProductMapper";
import { UserInputError } from "src/utils/errors";

export const getAllProducts = async (): Promise<Product[]> => {
  const client = await getClient();
  const { rows: allProductsDTO } = (await client.query(
    "select * from products p left join stocks s on p.id = s.product_id"
  )) as { rows: ProductStockDTO[] };
  await closeConnection(client);
  const allProducts = allProductsDTO.map(mapFromProductStockDTOtoProduct);
  return allProducts;
};

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  const client = await getClient();
  const query =
    "select * from products p left join stocks s on p.id = s.product_id where p.id = $1";
  const { rows: product } = (await client.query(query, [id])) as {
    rows: ProductStockDTO[];
  };
  await closeConnection(client);
  return product[0] ? mapFromProductStockDTOtoProduct(product[0]) : undefined;
};

export const createProduct = async (product: Omit<Product, "id">) => {
  validateProductInput(product);
  const client = await getClient();
  await client.query("BEGIN");
  const { rows: newProduct } = (await client.query(
    "INSERT INTO products (title, price, description) VALUES ($1, $2, $3) RETURNING *",
    [product.title, product.price, product.description]
  )) as { rows: ProductDTO[] };
  if (!newProduct[0]) {
    throw new Error();
  }
  const { rows: newStock } = (await client.query(
    "INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING *",
    [newProduct[0].id, product.count]
  )) as { rows: StockDTO[] };
  if (!newStock[0]) {
    throw new Error();
  }
  await client.query("COMMIT");
  await closeConnection(client);
  return { ...newProduct, ...newStock };
};

const validateProductInput = (product: Omit<Product, "id">) => {
  const invalidInputs = [];
  if (typeof product.title !== "string" || product.title.trim().length === 0) {
    invalidInputs.push("title");
  }
  if (
    typeof product.description !== "string" ||
    product.description.trim().length === 0
  ) {
    invalidInputs.push("description");
  }
  if (typeof product.price !== "number" || product.price < 0) {
    invalidInputs.push("price");
  }
  if (typeof product.count !== "number" || product.count < 0) {
    invalidInputs.push("count");
  }
  if (invalidInputs.length) {
    throw new UserInputError(...invalidInputs);
  }
};
