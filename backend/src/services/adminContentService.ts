import cloudinary from "../config/cloudinary";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import fs from "fs";

export const uploadNoteResource = async (data: { title: string; chapterId: string }, file: Express.Multer.File) => {
  const chapter = await prisma.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) {

    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw new AppError("Chapter not found", 404);
  }

  let fileUrl = "";

  try {
    const cloudResponse = await cloudinary.uploader.upload(file.path, {
      folder: "cn_master/notes",
      resource_type: "auto",
    });
    fileUrl = cloudResponse.secure_url;
  } catch (error) {
    throw new AppError("Failed to upload resource to Cloudinary", 500);
  } finally {

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }

  const newNote = await prisma.note.create({
    data: {
      title: data.title,
      chapterId: data.chapterId,
      pdfUrl: fileUrl,
    },
  });

  return {
    success: true,
    message: "Resource uploaded successfully",
    data: newNote,
  };
};