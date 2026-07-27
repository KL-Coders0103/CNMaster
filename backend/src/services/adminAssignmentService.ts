import prisma from "../config/prisma";
import cloudinary from "../config/cloudinary";
import { AppError } from "../utils/AppError";
import { AssignmentFileType, AssignmentStatus } from "@prisma/client";
import fs from "fs"; 

export const createAssignment = async (data: any, file?: Express.Multer.File) => {
  let fileUrl = ""; 

  if (file) {
    try {
      const cloudResponse = await cloudinary.uploader.upload(file.path, {
        folder: "cn_master/assignments",
        resource_type: "auto",
      });
      fileUrl = cloudResponse.secure_url;
    } catch (error) {
      throw new AppError("Failed to upload assignment file to Cloudinary", 500);
    } finally {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }

  return {
    success: true,
    data: await prisma.assignment.create({
      data: { ...data, assignmentUrl: fileUrl }
    }),
  };
};

export const getAssignmentSubmissions = async (assignmentId: string) => {
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      student: { select: { id: true, fullName: true, email: true } }
    },
    orderBy: { submittedAt: 'desc' },
    take: 100 
  });
  return { success: true, data: submissions };
};

export const gradeSubmission = async (submissionId: string, data: { marksObtained: number; feedback?: string }) => {
  const submission = await prisma.assignmentSubmission.findUnique({ where: { id: submissionId } });
  
  if (!submission) throw new AppError("Submission not found", 404);
  
  if (submission.status === AssignmentStatus.REVIEWED) {
    throw new AppError("This submission has already been graded.", 400);
  }

  const updatedSubmission = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      marksObtained: data.marksObtained,
      feedback: data.feedback || "",
      status: AssignmentStatus.REVIEWED, 
    },
  });

  return { success: true, data: updatedSubmission };
};