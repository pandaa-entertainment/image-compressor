import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import type { OptimizeImageOptions } from "./types.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const UPLOAD_SIGNED_URL_EXPIRES_IN = 60 * 3; // 5 minutes

export async function isValidS3Key(
  s3: S3Client,
  bucketName: string,
  key: string
): Promise<boolean> {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    await s3.send(command);
    return true;
  } catch (error: any) {
    if (
      error?.$metadata?.httpStatusCode === 404 ||
      error?.name === "NotFound"
    ) {
      return false;
    }
    throw error;
  }
}

// export async function fetchImageBuffer(
//   url: string,
//   key: string,
//   bucketName: string,
//   s3: S3Client
// ): Promise<Buffer> {
//   const exists = await isValidS3Key(s3, bucketName, key);
//   if (!exists) {
//     throw new Error(`Invalid S3 key: ${key}`);
//   }

//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch image from ${url}: ${response.statusText}`
//     );
//   }

//   return Buffer.from(await response.arrayBuffer());
// }

export async function getImageUrlFromKey(
  props: OptimizeImageOptions
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: props.bucketName,
      Key: props.imageKey,
    });
    const signedUrl = await getSignedUrl(props.s3, command, {
      expiresIn: UPLOAD_SIGNED_URL_EXPIRES_IN,
    });
    return signedUrl;
  } catch (error) {
    throw new Error("Failed to get signed URL for  image.");
  }
}
