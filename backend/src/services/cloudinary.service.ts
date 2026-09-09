import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const uploadProfileImage = (
  fileBuffer: Buffer,
): Promise<{ secureUrl: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "employee-management-system/profiles",

        resource_type: "image",

        allowed_formats: ["jpg", "jpeg", "png", "webp"],

        transformation: [
          {
            width: 500,
            height: 500,
            crop: "limit",
          },
        ],
      },

      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Failed to upload profile image"));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteProfileImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};
