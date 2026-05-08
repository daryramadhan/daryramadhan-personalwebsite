import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return new Response(JSON.stringify({ error: "Missing filename or contentType" }), { status: 400 });
    }

    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${Netlify.env.get("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: Netlify.env.get("R2_ACCESS_KEY_ID") || "",
        secretAccessKey: Netlify.env.get("R2_SECRET_ACCESS_KEY") || "",
      },
    });

    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: Netlify.env.get("R2_BUCKET_NAME"),
      Key: uniqueFilename,
      ContentType: contentType,
    });

    const url = await getSignedUrl(S3, command, { expiresIn: 900 });
    const publicUrlBase = Netlify.env.get("R2_PUBLIC_URL")?.replace(/\/$/, "");

    return new Response(JSON.stringify({
      uploadUrl: url,
      filename: uniqueFilename,
      publicUrl: `${publicUrlBase}/${uniqueFilename}`
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
