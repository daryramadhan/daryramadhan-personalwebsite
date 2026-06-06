import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getEnv = (key: string) => {
  if (typeof Netlify !== 'undefined' && Netlify.env) {
    return Netlify.env.get(key) || process.env[key];
  }
  return process.env[key];
};

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return new Response(JSON.stringify({ error: "Missing filename or contentType" }), { status: 400 });
    }

    const accountId = getEnv("R2_ACCOUNT_ID");
    const accessKeyId = getEnv("R2_ACCESS_KEY_ID");
    const secretAccessKey = getEnv("R2_SECRET_ACCESS_KEY");
    const bucketName = getEnv("R2_BUCKET_NAME");
    const publicUrlEnv = getEnv("R2_PUBLIC_URL");

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
       return new Response(JSON.stringify({ error: "Missing R2 storage configuration in environment variables" }), { status: 500 });
    }

    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    const url = await getSignedUrl(S3, command, { expiresIn: 900 });
    const publicUrlBase = publicUrlEnv?.replace(/\/$/, "");

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
