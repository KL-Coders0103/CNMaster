import multer from "multer";
import os from "os";
import { AppError } from "../utils/AppError";

const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: os.tmpdir(), 
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`);
  }
});

export const uploadAvatar = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
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
  storage: diskStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (assignmentMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only PDF, DOCX, Images, and ZIP files are allowed", 400));
    }
  },
});

export const uploadNote = multer({
  storage: diskStorage, 
  limits: { fileSize: 15 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only PDF and Image files are allowed for notes", 400));
    }
  },
});