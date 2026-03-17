import crypto from "crypto";

const BUNNY_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME!;
const BUNNY_TOKEN_KEY = process.env.BUNNY_TOKEN_KEY!;

export function generateSignedUrl(videoId: string, ipAddress: string): string {
  const expirationTime = Math.floor(Date.now() / 1000) + 7200; // 2 hours
  const path = `/${videoId}/playlist.m3u8`;
  const url = `https://${BUNNY_CDN_HOSTNAME}${path}`;

  const hashableBase = `${BUNNY_TOKEN_KEY}${path}${expirationTime}${ipAddress}`;
  const token = crypto
    .createHash("sha256")
    .update(hashableBase)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${url}?token=${token}&expires=${expirationTime}&token_path=${encodeURIComponent(path)}`;
}

export async function uploadToBunny(file: ArrayBuffer, filename: string): Promise<string> {
  const libraryId = process.env.BUNNY_LIBRARY_ID!;
  const apiKey = process.env.BUNNY_API_KEY!;

  const createResponse = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: apiKey,
      },
      body: JSON.stringify({ title: filename }),
    }
  );

  const video = await createResponse.json();
  const videoId = video.guid;

  await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
    {
      method: "PUT",
      headers: {
        AccessKey: apiKey,
      },
      body: file,
    }
  );

  return videoId;
}
