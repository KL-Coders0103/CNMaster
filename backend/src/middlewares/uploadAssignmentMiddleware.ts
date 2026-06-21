import multer from "multer";
import { AppError } from "../utils/AppError";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback
) => {

  const allowedMimeTypes = [
    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "image/jpeg",
    "image/png",
    "image/jpg",

    "application/zip",
    "application/x-zip-compressed",
  ];

  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {

    callback(null, true);

  } else {

    callback(
      new AppError(
        "Only PDF, DOCX, Images and ZIP files are allowed",
        400
      )
    );
  }
};

export const uploadAssignment =
  multer({
    storage,

    limits: {
      fileSize:
        20 * 1024 * 1024,
    },

    fileFilter,
  });