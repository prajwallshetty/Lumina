import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary server client. Used by the Media Library for signed uploads,
 * transformations and deletions. Configure keys in `.env`.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "lumina";

/** Create a signed payload the client uploader can use directly against Cloudinary. */
export function createUploadSignature(params: Record<string, string | number> = {}) {
  const timestamp = Math.round(Date.now() / 1000);
  const toSign = { timestamp, folder: UPLOAD_FOLDER, ...params };
  const signature = cloudinary.utils.api_sign_request(
    toSign,
    process.env.CLOUDINARY_API_SECRET ?? "",
  );
  return {
    signature,
    timestamp,
    folder: UPLOAD_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

export async function deleteAsset(publicId: string, resourceType: "image" | "video" = "image") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export { cloudinary };
