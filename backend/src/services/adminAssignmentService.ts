import prisma from "../config/prisma";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { AppError } from "../utils/AppError";
import { AssignmentFileType, AssignmentStatus } from "@prisma/client";

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


export const createAssignment = async (
  data: { 
    title: string; 
    description?: string; 
    dueDate: Date; 
    totalMarks: number; 
    chapterId: string;
    createdById: string; 
    fileType: AssignmentFileType; 
  },
  file?: Express.Multer.File
) => {
  let fileUrl = ""; 

  if (file) {
    const cloudResponse = await uploadToCloudinary(file.buffer, "cn_master/assignments");
    fileUrl = cloudResponse.secure_url;
  }

  const newAssignment = await prisma.assignment.create({
    data: {
      title: data.title,
      description: data.description || "", 
      dueDate: data.dueDate,
      totalMarks: data.totalMarks,
      chapterId: data.chapterId, 
      assignmentUrl: fileUrl, 
      createdById: data.createdById, 
      fileType: data.fileType, 
    },
  });

  return {
    success: true,
    message: "Assignment created successfully",
    data: newAssignment,
  };
};

export const getAssignmentSubmissions = async (assignmentId: string) => {
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      student: {
        select: { id: true, fullName: true }, 
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return { success: true, data: submissions };
};

export const gradeSubmission = async (
  submissionId: string,
  data: { marksObtained: number; feedback?: string }
) => {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) throw new AppError("Submission not found", 404);

  const updatedSubmission = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      marksObtained: data.marksObtained,
      feedback: data.feedback || "",
      status: AssignmentStatus.REVIEWED, 
    },
  });

  return {
    success: true,
    message: "Submission graded successfully",
    data: updatedSubmission,
  };
};