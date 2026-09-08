import multer from "multer";
import path from "path";

import { AppError } from "../utils/app.error.js";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const extension = path.extname(file.originalname).toLowerCase();

  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

  const isValidExtension = allowedExtensions.includes(extension);

  if (!isValidMimeType || !isValidExtension) {
    callback(new AppError("Only JPEG, PNG, and WebP images are allowed", 400));
    return;
  }

  callback(null, true);
};

export const profileImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
