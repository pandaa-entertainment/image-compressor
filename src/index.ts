import sharp from "sharp";
import { getImageUrlFromKey } from "./utils.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { OptimizeImageOptions } from "./types.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fetch from "node-fetch";
import { compressImage } from "./compression.js";

declare module "sharp" {
  interface Sharp {
    limitInputPixels: number;
  }
}

sharp.cache(false);
sharp.prototype.limitInputPixels = Number.MAX_SAFE_INTEGER;

const UPLOAD_SIGNED_URL_EXPIRES_IN = 60 * 3; // 5 minutes

export async function optimizePublicImage(
  props: OptimizeImageOptions
): Promise<Buffer> {
  const s3ImageUrl = await getImageUrlFromKey(props);

  if (!s3ImageUrl) {
    throw new Error("Failed to get private image URL.");
  }

  const imageUrl = await fetch(s3ImageUrl);

  if (!imageUrl.ok) {
    throw new Error(`Failed to fetch private image: ${imageUrl.statusText}`);
  }

  const imageBuffer = Buffer.from(await imageUrl.arrayBuffer());

  return await compressImage(imageBuffer);
}

export async function optimizePrivateImage(
  props: OptimizeImageOptions
): Promise<Buffer> {
  try {
    const privateImageUrl = await getPrivateImageUrl(props);

    if (!privateImageUrl) {
      throw new Error("Failed to get private image URL.");
    }

    const imageUrl = await fetch(privateImageUrl);

    if (!imageUrl.ok) {
      throw new Error(`Failed to fetch private image: ${imageUrl.statusText}`);
    }

    const imageBuffer = Buffer.from(await imageUrl.arrayBuffer());

    return await compressImage(imageBuffer);
  } catch (error) {
    throw new Error("Failed to optimize private image.");
  }
}

async function getPrivateImageUrl(
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
    throw new Error("Failed to get signed URL for private image.");
  }
}
