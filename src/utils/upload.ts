import { cloudinary } from "@/config/cloudinary";

import crypto from "crypto";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (
  file: Blob,
  folder: string = "blog_covers"
): Promise<CloudinaryUploadResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const hash = crypto
    .createHash("md5")
    .update(buffer)
    .digest("hex")
    .slice(0, 12);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { 
          folder,
          public_id: hash,
          overwrite: true,
          resource_type: "auto"
        },
        (error, result) => {
          if (error) {
            reject(new Error("Failed to upload image"));
          } else {
            resolve({
              secure_url: result?.secure_url as string,
              public_id: result?.public_id as string
            });
          }
        }
      )
      .end(buffer);
  });
};
