import { catalogBatchProcess } from "../handler";
import * as productService from "src/services/ProductService";
import * as middyfy from "@libs/lambda";

jest.mock("@libs/lambda");
jest.mock("src/services/ProductService");

const stringifyProduct= '{"\ufeffcount":"5","description":"Test2","price":"20","title":"Test2"}';
const mockEvent = {
  Records: [
    {
      messageId: "",
      receiptHandle:
        "",
      body: stringifyProduct,
      attributes: {
        ApproximateReceiveCount: "",
        SentTimestamp: "",
        SenderId: "",
        ApproximateFirstReceiveTimestamp: "",
      },
      messageAttributes: {},
      md5OfBody: "",
      eventSource: "",
      eventSourceARN: "",
      awsRegion: "",
    },
  ],
};

describe("getProducts test", () => {
  beforeAll(() => {
    const middyfyMock = jest.spyOn(middyfy, "middyfy");
    middyfyMock.mockImplementation(() => undefined);
    const createMultipleProducts = jest.spyOn(
      productService,
      "createMultipleProducts"
    );
    createMultipleProducts.mockImplementation(() => null);
  });
  it("it should trigger one sqs message", async () => {
    let publishMessage = jest.spyOn(
      productService,
      "publishProductsViaSNS"
    );
    publishMessage.mockImplementation(() => null);
    await catalogBatchProcess(mockEvent);
    expect(publishMessage.mock.calls.length).toBe(1);
  });
  it("content should be the product mapped and stringified", async () => {
    let publishMessage = jest.spyOn(
      productService,
      "publishProductsViaSNS"
    );
    publishMessage.mockImplementation(() => null);
    await catalogBatchProcess(mockEvent);
    const expectedProduct={count:5, description:'Test2', price:20, title:'Test2'};
    const returnedProduct=publishMessage.mock.calls[0][0][0];
    expect(returnedProduct.count).toBe(expectedProduct.count);
    expect(returnedProduct.description).toBe(expectedProduct.description);
    expect(returnedProduct.price).toBe(expectedProduct.price);
    expect(returnedProduct.title).toBe(expectedProduct.title);
  });
});
