import sharp from "sharp";
import { CompressImageInterface } from "./types";

export async function compressImage(
  props: CompressImageInterface
): Promise<Buffer> {
  const image = sharp(props.imageBuffer, {
    limitInputPixels: Number.MAX_SAFE_INTEGER,
  });

  const metadata = await image.metadata();

  const width = metadata.width!;
  const height = metadata.height!;
  const aspectRatio = width / height;

  const compressedMaxWidth = Number(props?.maxWidth) || 2560;
  const compressedMaxHeight = Number(props?.maxHeight) || 1440;
  const compressedQuality = Number(props?.quality) || 70;

  let finalWidth = width;
  let finalHeight = height;

  const resizeNeeded =
    width > compressedMaxWidth || height > compressedMaxHeight;

  if (resizeNeeded) {
    if (width > height) {
      finalWidth = compressedMaxWidth;
      finalHeight = Math.round(finalWidth / aspectRatio);
    } else {
      finalHeight = compressedMaxHeight;
      finalWidth = Math.round(finalHeight * aspectRatio);
    }
  }

  const optimizedImageBuffer = await sharp(props.imageBuffer, {
    limitInputPixels: Number.MAX_SAFE_INTEGER,
  })
    .resize({
      width: finalWidth,
      height: finalHeight,
      withoutEnlargement: true,
    })
    .webp({
      quality: compressedQuality,
      effort: 3,
    })
    .toBuffer();

  return optimizedImageBuffer;
}
