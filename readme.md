# 📦 @pandaa-entertainment/image-optimization

Efficient image compression & optimization for AWS S3 using **Sharp**.
Designed for **Node.js**, **serverless environments (AWS Lambda)**, and high-performance image workflows.

---

## 🚀 Features

- ⚡ **Compress large images while preserving quality**
- ☁️ **Directly fetch and upload images to Amazon S3**
- 🛠 **Supports JPEG, PNG, WEBP**
- 🔄 **Buffer-based (no temporary file leaks)**
- 🧩 **ESM + CJS support**

---

## 📥 Installation

Using npm:

```bash
npm install @pandaa-entertainment/image-optimization
```

Or using yarn:

```bash
yarn add @pandaa-entertainment/image-optimization
```

---

## ✨ Quick Usage Example

```ts
import { optimizeImage } from "@pandaa-entertainment/image-optimization";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

async function run() {
  const result = await optimizeImage({
    s3,
    bucketName: "my-bucket",
    imageKey: "images/my-large-image.jpg",
  });

  console.log("Optimization result:", result);
}

run().catch(console.error);
```

---

## 🔧 Options

| Option       | Type     | Required | Description                       |
| ------------ | -------- | -------- | --------------------------------- |
| `s3`         | S3Client | ✔        | AWS S3 Client instance            |
| `bucketName` | string   | ✔        | Bucket name where the image lives |
| `imageKey`   | string   | ✔        | Key/path of the image in S3       |

---

## 🧩 API Exports

```ts
import {
  optimizeImage,
  uploadImageToS3,
} from "@pandaa-entertainment/image-optimization";
```

- `optimizeImage()` → Downloads → Compresses → Reuploads
- `uploadImageToS3()` → Uploads compressed buffer directly

---

## 📊 Format Behavior

| Format | Compression | Notes              |
| ------ | ----------- | ------------------ |
| JPEG   | ✔ ✔         | Lossy optimization |
| PNG    | ✔ ✔         | Lossless supported |
| WEBP   | 🔥          | Efficient for web  |

---

## 📦 Requirements

| Tool       | Version  |
| ---------- | -------- |
| Node.js    | >=18     |
| AWS SDK v3 | Included |

---

## 🛠 Example AWS Lambda Integration

```ts
import { S3Client } from "@aws-sdk/client-s3";
import { optimizeImage } from "@pandaa-entertainment/image-optimization";

export const handler = async (event) => {
  const { bucket, object } = event.Records[0].s3;

  await optimizeImage({
    s3: new S3Client(),
    bucketName: bucket.name,
    imageKey: object.key,
  });

  return { status: "optimized" };
};
```

---

## 📄 License

MIT © Pandaa Entertainment

---

## 🔑 Keywords (SEO)

```
image, image-optimization, s3, sharp, compress, upload, optimize, image-compress
```
