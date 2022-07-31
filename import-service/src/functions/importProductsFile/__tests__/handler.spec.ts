import {
  getS3Instance,
  getS3SignedUrlPromise,
} from "../../../services/storageService";
import { importProductsFile } from "../handler";

jest.mock("../../../services/storageService", () => ({
  getS3Instance: jest.fn(),
  getS3SignedUrlPromise: jest.fn(),
}));

describe("importProductsFile", () => {
  const mockCorrectEvent = {
    queryStringParameters: { name: "something" },
  };
  const mockBadEvent = {
    queryStringParameters: { name: "", location: "other" },
  };
  const mockSignedURL = "mocksignedurl.com";
  beforeEach(() => {
    (getS3Instance as jest.Mock).mockReturnValue({});
    (getS3SignedUrlPromise as jest.Mock).mockReturnValue(mockSignedURL);
  });

  it("Correct event is provided then it return 200 status code", async () => {
    const response = await importProductsFile(mockCorrectEvent);
    expect(response.statusCode).toBe(200);
  });

  it("Correct event is provided then a signed url is returned", async () => {
    const response = await importProductsFile(mockCorrectEvent);
    expect(response.body).toBe(JSON.stringify(mockSignedURL));
  });

  it("Incorrect event is provided then it return 400 status code", async () => {
    const response = await importProductsFile(mockBadEvent);
    expect(response.statusCode).toBe(400);
  });

  it("S3 service throw an error then it return 500 status code", async () => {
    (getS3SignedUrlPromise as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    const response = await importProductsFile(mockCorrectEvent);
    expect(response.statusCode).toBe(500);
  });
});
