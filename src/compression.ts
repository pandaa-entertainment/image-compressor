import sharp from "sharp";

export async function compressImage(
  imageBuffer: Buffer,
  maxWidth = 2560,
  maxHeight = 1440
): Promise<Buffer> {
  const image = sharp(imageBuffer, {
    limitInputPixels: Number.MAX_SAFE_INTEGER,
  });

  const metadata = await image.metadata();

  const width = metadata.width!;
  const height = metadata.height!;
  const aspectRatio = width / height;

  let finalWidth = width;
  let finalHeight = height;

  const resizeNeeded = width > maxWidth || height > maxHeight;

  if (resizeNeeded) {
    if (width > height) {
      finalWidth = maxWidth;
      finalHeight = Math.round(finalWidth / aspectRatio);
    } else {
      finalHeight = maxHeight;
      finalWidth = Math.round(finalHeight * aspectRatio);
    }
  }

  const optimizedImageBuffer = await sharp(imageBuffer, {
    limitInputPixels: Number.MAX_SAFE_INTEGER,
  })
    .resize({
      width: finalWidth,
      height: finalHeight,
      withoutEnlargement: true,
    })
    .webp({
      quality: 70,
      effort: 3,
    })
    .toBuffer();

  await sharp(optimizedImageBuffer).toFile("optimized-image-separated.webp");

  return optimizedImageBuffer;
}
