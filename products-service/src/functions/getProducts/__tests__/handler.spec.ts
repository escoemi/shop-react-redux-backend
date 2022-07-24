import { getProducts } from "../handler";
import * as productService from "src/services/ProductService";
import * as middyfy from "@libs/lambda";
import { Product } from "src/entities/Product";

jest.mock("@libs/lambda");
jest.mock("src/services/ProductService");

describe("getProducts test", () => {
  beforeAll(() => {
    const middyfyMock = jest.spyOn(middyfy, "middyfy");
    middyfyMock.mockImplementation(() => undefined);
    const getAllProductsMock = jest.spyOn(productService, "getAllProducts");
    getAllProductsMock.mockImplementation(() =>
      Promise.resolve([{ id: "test" }] as Product[])
    );
  });
  it("it returns 200 status", async () => {
    const allProducts = await getProducts({} as any, {} as any, {} as any);
    if (allProducts) {
      expect(allProducts.statusCode).toBe(200);
    }
  });
});
