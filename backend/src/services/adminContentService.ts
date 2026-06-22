import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" }, 
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const uploadNoteResource = async (data: { title: string; chapterId: string }, file: Express.Multer.File) => {
  const chapter = await prisma.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) throw new AppError("Chapter not found", 404);

  const cloudResponse = await uploadToCloudinary(file.buffer, "cn_master/notes");

  const newNote = await prisma.note.create({
    data: {
      title: data.title,
      chapterId: data.chapterId,
      pdfUrl: cloudResponse.secure_url,
    },
  });

  return {
    success: true,
    message: "Resource uploaded successfully",
    data: newNote,
  };
};