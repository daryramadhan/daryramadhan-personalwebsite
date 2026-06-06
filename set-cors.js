import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://2c9a9919da50677f86d68e25d32df7ba.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "ffb7e0cc550166f53efe0dd5ec24a735",
    secretAccessKey: "95f01bb876c84088a6469d888d933df10d1cb2a319cd5dccb070f2278284305e",
  },
});

async function run() {
  try {
    const command = new PutBucketCorsCommand({
      Bucket: "dary-images",
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ["*"], // We can restrict this later, but * is good for testing
            AllowedMethods: ["PUT", "GET", "OPTIONS", "HEAD", "POST"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    });

    await S3.send(command);
    console.log("Successfully updated CORS policy for Cloudflare R2 bucket!");
  } catch (error) {
    console.error("Error setting CORS:", error);
  }
}

run();
