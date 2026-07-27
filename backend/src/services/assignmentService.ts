import fs from "fs/promises";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export const fetchAssignments = async (studentId: string, chapterId?: string, search?: string) => {
  const assignments = await prisma.assignment.findMany({
    where: {
      isPublished: true,
      ...(chapterId && { chapterId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      chapter: true, 
      submissions: {
        where: { studentId },
        select: { status: true },
      },
    },
    orderBy: { dueDate: "asc" },
    take: 50, 
  });

  const formattedAssignments = assignments.map((assignment) => ({
    ...assignment,
    submissionStatus:
      assignment.submissions?.[0]?.status ??
      (new Date(assignment.dueDate) < new Date() ? "OVERDUE" : "PENDING"),
  }));

  return {
    success: true,
    message: "Assignments fetched successfully",
    data: formattedAssignments,
  };
};

export const fetchAssignmentDetails = async (assignmentId: string, studentId: string) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { chapter: true }, 
  });

  if (!assignment) throw new AppError("Assignment not found", 404);

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
  });

  return {
    success: true,
    data: {
      ...assignment,
      submissionStatus: submission?.status ?? "PENDING",
      submittedAt: submission?.submittedAt ?? null,
      marksObtained: submission?.marksObtained ?? null,
      feedback: submission?.feedback ?? null,
    },
  };
};

export const submitAssignment = async (assignmentId: string, studentId: string, submissionUrl: string) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) throw new AppError("Assignment not found", 404);

  const isLateSubmission = new Date() > assignment.dueDate;

  await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: { assignmentId, studentId },
    },
    update: {
      submissionUrl,
      submittedAt: new Date(),
      status: "SUBMITTED",
      isLateSubmission,
    },
    create: {
      assignmentId,
      studentId,
      submissionUrl,
      isLateSubmission,
    },
  });

  return {
    success: true,
    message: "Assignment submitted successfully",
  };
};

export const fetchSubmissionHistory = async (studentId: string) => {
  const history = await prisma.assignmentSubmission.findMany({
    where: { studentId },
    include: {
      assignment: {
        include: { chapter: true }, 
      },
    },
    orderBy: { submittedAt: "desc" },
    take: 50,
  });

  return { 
    success: true, 
    message: "Submission history fetched successfully", 
    data: history 
  };
};

export const fetchUpcomingAssignment = async (studentId: string) => {
  const assignment = await prisma.assignment.findFirst({
    where: {
      isPublished: true,
      dueDate: { gte: new Date() },
      submissions: { none: { studentId } },
    },
    include: { chapter: true }, 
    orderBy: { dueDate: "asc" },
  });

  return { 
    success: true, 
    data: assignment 
  };
};

export const fetchAssignmentAnalytics = async (studentId: string) => {

  const [submissionStats, totalPublishedAssignments] = await Promise.all([
    prisma.assignmentSubmission.aggregate({
      where: { studentId },
      _count: { id: true },
      _avg: { marksObtained: true } 
    }),
    prisma.assignment.count({
      where: { isPublished: true }
    })
  ]);

  const completed = submissionStats._count.id;
  const pending = Math.max(0, totalPublishedAssignments - completed);
  
  const averageMarks = submissionStats._avg.marksObtained 
    ? Math.round(submissionStats._avg.marksObtained) 
    : 0;

  const totalPossible = completed + pending;
  const submissionRate = totalPossible === 0 
    ? 0 
    : Math.round((completed / totalPossible) * 100);

  return { 
    success: true, 
    data: { completed, pending, averageMarks, submissionRate } 
  };
};

export const uploadAssignmentFile = async (file: Express.Multer.File): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "cn-master/assignment-submissions",
      resource_type: "auto",
    });

    await fs.unlink(file.path).catch((err) => {
      console.error(`[FS ERROR] Failed to clean up temp file: ${file.path}`, err);
    });

    return result;
  } catch (error: any) {
    if (file.path) await fs.unlink(file.path).catch(() => {});
    
    if (error instanceof AppError) throw error;
    throw new AppError(`Cloudinary Upload Error: ${error.message || "Unknown"}`, 500);
  }
};