## How to use this package

#### install the package

```bash
npm i optimize-s3-image
```

#### import `optimizePublicImage` for image with public key or publicly accessible and import `optimizePrivateImage` for image with private key.

#### types

```ts
interface OptimizeImageOptions {
  imageKey: string;
  bucketName: string;
  s3: S3Client;
}
```

### create S3Client like below or any your way and pass to the props in optimizier functions

```ts
export const getS3Client = () => {
  let s3Client = null;
  if (!s3Client) {
    s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
      },
      region: process.env.region,
    });
  }
  return s3Client;
};
const s3 = getS3Client();
```

### For public key

```ts
function optimizePublicImage(props: OptimizeImageOptions): Promise<Buffer> {}
```

### For private key

```ts
function optimizePrivateImage(props: OptimizeImageOptions): Promise<Buffer> {}
```
