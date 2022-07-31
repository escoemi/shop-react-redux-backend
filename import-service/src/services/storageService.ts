import { S3 } from "aws-sdk";

export function getS3Instance(region: string) {
  return new S3({ region, signatureVersion: "v4" });
}

export function getS3ReadStream(s3: S3, bucketName: string, filePath: string) {
  return s3
    .getObject({
      Bucket: bucketName,
      Key: filePath,
    })
    .createReadStream();
}

export async function moveS3Object(
  s3: S3,
  bucketName: string,
  filePath: string,
  destination: string
) {
  await s3
    .copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${filePath}`,
      Key: destination,
    })
    .promise();

  await s3
    .deleteObject({
      Bucket: bucketName,
      Key: filePath,
    })
    .promise();
}

export function getS3SignedUrlPromise(
  s3: S3,
  action: string,
  bucketName: string,
  filePath: string
) {
  const params = {
    Bucket: bucketName,
    Key: filePath,
    Expires: 60,
    ContentType: "text/csv",
  };
  return s3.getSignedUrlPromise(action, params);
}
