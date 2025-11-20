import { S3Client } from "@aws-sdk/client-s3";

export interface OptimizeImageOptions {
  imageKey: string;
  bucketName: string;
  s3: S3Client; // user must provide S3 client
}

export interface UploadImageInS3Props {
  imageBuffer: Buffer;
  s3Values: OptimizeImageOptions;
}
