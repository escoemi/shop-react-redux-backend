import { middyfy } from "@libs/lambda";
import {
  getS3Instance,
  getS3ReadStream,
  moveS3Object,
} from "src/services/storageService";
import { parseCSVFromReadStream } from "src/services/importSerivce";
import { formatJSONResponse } from "@libs/api-gateway";

const { REGION, BUCKET_NAME } = process.env;

const importFileParser = async (event) => {
  try {
    console.log("importFileParser:", event);
    const s3 = getS3Instance(REGION);

    for (const record of event.Records) {
      const filePath = record.s3.object.key;
      const destination = filePath.replace("uploaded", "parsed");
      const s3ReadStream = getS3ReadStream(s3, BUCKET_NAME, filePath);
      await parseCSVFromReadStream(s3ReadStream);
      await moveS3Object(s3, BUCKET_NAME, filePath, destination);
    }

    return formatJSONResponse({ successul: true }, 200);
  } catch (err) {
    console.error(err);
    const { code, message } = err;

    return formatJSONResponse({ successul: false, message }, code);
  }
};

export const main = middyfy(importFileParser);
