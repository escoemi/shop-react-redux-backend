import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import {
  getS3Instance,
  getS3SignedUrlPromise,
} from "src/services/storageService";

const { REGION, BUCKET_NAME } = process.env;

export const importProductsFile = async (event) => {
  const fileName = event.queryStringParameters.name;

  if (!fileName) {
    return formatJSONResponse(
      { successful: false, message: "File name is missing" },
      400
    );
  }

  const filePath = `uploaded/${fileName}`;
  const s3 = getS3Instance(REGION);

  try {
    const signedUrl = await getS3SignedUrlPromise(
      s3,
      "putObject",
      BUCKET_NAME,
      filePath
    );
    return formatJSONResponse(
      signedUrl as unknown as Record<string, unknown>,
      200
    );
  } catch (error) {
    return formatJSONResponse({ successful: false }, error.statusCode || 500);
  }
};

export const main = middyfy(importProductsFile);
