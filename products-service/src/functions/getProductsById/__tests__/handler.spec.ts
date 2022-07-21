import { getProductsById } from "../handler";
import * as productService from "src/services/ProductService";
import * as middyfy from "@libs/lambda";
import { Product } from "src/entities/Product";

jest.mock("@libs/lambda");
jest.mock("src/services/ProductService");

describe("getProducts test", () => {
  const eventMock = { pathParameters: { id: "test" } };
  const eventMockNotFound = { pathParameters: { id: "aaa" } };
  let getProductByIdMock;
  beforeAll(() => {
    const middyfyMock = jest.spyOn(middyfy, "middyfy");
    middyfyMock.mockImplementation(() => undefined);
    getProductByIdMock = jest.spyOn(productService, "getProductById");
  });
  it("it returns 200 status", async () => {
    getProductByIdMock.mockImplementation(() =>
      Promise.resolve({ id: "test" } as Product)
    );
    const product = await getProductsById(
      eventMock as any,
      {} as any,
      {} as any
    );
    if (product) {
      expect(product.statusCode).toBe(200);
    }
  });
  it("it returns 404 status", async () => {
    getProductByIdMock.mockImplementation(() => Promise.resolve(undefined));
    const product = await getProductsById(
      eventMockNotFound as any,
      {} as any,
      {} as any
    );
    if (product) {
      expect(product.statusCode).toBe(404);
    }
  });
});
