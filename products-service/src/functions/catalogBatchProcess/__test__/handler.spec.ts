import { catalogBatchProcess } from "../handler";
import * as productService from "src/services/ProductService";
import * as snsService from "src/services/SNSService";
import * as middyfy from "@libs/lambda";

jest.mock("@libs/lambda");
jest.mock("src/services/ProductService");
jest.mock("src/services/SNSService");
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
      snsService,
      "publishSNSMessage"
    );
    publishMessage.mockImplementation(() => null);
    await catalogBatchProcess(mockEvent);
    expect(publishMessage.mock.calls.length).toBe(1);
  });
  it("title should be Products uploaded", async () => {
    let publishMessage = jest.spyOn(
      snsService,
      "publishSNSMessage"
    );
    publishMessage.mockImplementation(() => null);
    await catalogBatchProcess(mockEvent);
    expect(publishMessage.mock.calls[0][0]).toBe('Products uploaded');
  });
  it("title should be the product mapped and stringified uploaded", async () => {
    let publishMessage = jest.spyOn(
      snsService,
      "publishSNSMessage"
    );
    publishMessage.mockImplementation(() => null);
    await catalogBatchProcess(mockEvent);
    const expectedProduct={count:5, description:'Test2', price:20, title:'Test2'};
    const returnedProduct=JSON.parse(publishMessage.mock.calls[0][1])[0];
    expect(returnedProduct.count).toBe(expectedProduct.count);
    expect(returnedProduct.description).toBe(expectedProduct.description);
    expect(returnedProduct.price).toBe(expectedProduct.price);
    expect(returnedProduct.title).toBe(expectedProduct.title);
  });
});
