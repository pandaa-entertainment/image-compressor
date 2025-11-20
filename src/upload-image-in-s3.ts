import { PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadImageInS3Props } from "./types";

export async function uploadImageInS3(
  props: UploadImageInS3Props
): Promise<void> {
  const { imageBuffer, s3Values } = props;

  const { s3, bucketName, imageKey } = s3Values;

  const uploadParams = {
    Bucket: bucketName,
    Key: imageKey,
    Body: imageBuffer,
    ContentType: "image/webp",
    Metadata: {
      optimized: "true",
    },
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
  } catch (error) {
    throw new Error("S3 upload failed");
  }
}
