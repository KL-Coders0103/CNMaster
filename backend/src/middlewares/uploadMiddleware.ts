import multer from "multer";
import { AppError } from "../utils/AppError";

const storage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files are allowed", 400));
    }
  },
});

const assignmentMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/zip",
  "application/x-zip-compressed",
];

export const uploadAssignment = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (assignmentMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only PDF, DOCX, Images, and ZIP files are allowed", 400));
    }
  },
});