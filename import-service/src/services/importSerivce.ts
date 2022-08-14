import { Readable } from "stream";
import csv from "csv-parser";

export async function parseCSVFromReadStream(s3ReadStream: Readable) {
  return new Promise((resolve, reject) => {
    s3ReadStream
      .pipe(csv())
      .on("data", (data) => {
        console.log(JSON.stringify(data, null, 4));
      })
      .on("end", resolve)
      .on("error", reject);
  });
}
