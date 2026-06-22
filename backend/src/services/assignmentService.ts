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
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { studentId },
    include: { assignment: true },
  });

  const completed = submissions.length;

  const pending = await prisma.assignment.count({
    where: {
      isPublished: true,
      submissions: { none: { studentId } },
    },
  });

  const reviewed = submissions.filter((item) => item.marksObtained !== null);

  const averageMarks =
    reviewed.length === 0
      ? 0
      : Math.round(reviewed.reduce((sum, item) => sum + (item.marksObtained ?? 0), 0) / reviewed.length);

  const submissionRate = completed + pending === 0 ? 0 : Math.round((completed / (completed + pending)) * 100);

  return { 
    success: true, 
    data: { completed, pending, averageMarks, submissionRate } 
  };
};

export const uploadAssignmentFile = async (file: Express.Multer.File): Promise<UploadApiResponse> => {
  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "cn-master/assignment-submissions",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(new AppError(`Cloudinary Upload Error: ${error.message}`, 500));
          }

          if (!result) {
            return reject(new AppError("Upload failed: No result from Cloudinary", 500));
          }

          resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("An unexpected error occurred during file upload", 500);
  }
};