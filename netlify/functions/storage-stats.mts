import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${Netlify.env.get("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: Netlify.env.get("R2_ACCESS_KEY_ID") || "",
        secretAccessKey: Netlify.env.get("R2_SECRET_ACCESS_KEY") || "",
      },
    });

    const command = new ListObjectsV2Command({
      Bucket: Netlify.env.get("R2_BUCKET_NAME"),
    });

    const response = await S3.send(command);
    
    let totalBytes = 0;
    let fileCount = 0;

    if (response.Contents) {
      fileCount = response.Contents.length;
      totalBytes = response.Contents.reduce((acc, item) => acc + (item.Size || 0), 0);
    }

    const maxBytes = 10 * 1024 * 1024 * 1024; // 10 GB Free Tier Limit
    const percentage = (totalBytes / maxBytes) * 100;

    return new Response(JSON.stringify({
      usedBytes: totalBytes,
      maxBytes: maxBytes,
      percentage: percentage,
      fileCount: fileCount
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
