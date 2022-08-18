import { Readable } from "stream";
import csv from "csv-parser";
import { sendSQSMessage } from "./SQSService";

export async function parseCSVFromReadStream(s3ReadStream: Readable) {
  return new Promise((resolve, reject) => {
    s3ReadStream
      .pipe(csv())
      .on("data", (data) => {
        sendSQSMessage(JSON.stringify(data));
      })
      .on("end", resolve)
      .on("error", reject);
  });
}