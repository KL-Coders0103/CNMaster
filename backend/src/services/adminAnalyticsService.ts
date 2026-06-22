import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export const getOverallDashboardStats = async () => {
  const [
    totalStudents,
    suspendedStudents,
    totalQuizzesTaken,
    totalAssignmentsSubmitted,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { isSuspended: true } }),
    prisma.quizAttempt.count(),
    prisma.assignmentSubmission.count(), 
  ]);

  const averageScoreAgg = await prisma.quizAttempt.aggregate({
    _avg: { score: true },
  });

  return {
    success: true,
    data: {
      users: {
        total: totalStudents,
        active: totalStudents - suspendedStudents,
        suspended: suspendedStudents,
      },
      engagement: {
        totalQuizzesTaken,
        totalAssignmentsSubmitted,
        platformAverageScore: averageScoreAgg._avg.score || 0,
      },
    },
  };
};

export const getAdminLeaderboard = async (limit: number) => {
  const topStudents = await prisma.user.findMany({
    where: { role: "student", isSuspended: false },
    select: {
      id: true,
      fullName: true,
      year: true,
      branch: true,
      userStats: {
        select: {
          level: true,
          xpCurrent: true,
          streakDays: true,
        },
      },
    },
    orderBy: {
      userStats: { xpCurrent: "desc" },
    },
    take: limit,
  });

  return {
    success: true,
    data: topStudents,
  };
};

export const getIndividualStudentAnalytics = async (userId: string) => {
  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      isSuspended: true,
      createdAt: true,
      userStats: true,
      weakAreas: true,
      quizAttempts: {
        select: {
          id: true,
          score: true,
          startedAt: true,
          completedAt: true,
          assessment: { select: { title: true, type: true } },
        },
        orderBy: { startedAt: "desc" },
        take: 15,
      },
      readingProgress: {
        select: {
          lastOpenedAt: true,
          timeSpent: true, 
          note: { select: { title: true, chapter: { select: { title: true } } } },
        },
        orderBy: { lastOpenedAt: "desc" },
        take: 15,
      },
      submissions: {
        select: {
          status: true,
          submittedAt: true,
          marksObtained: true,
          assignment: { select: { title: true } },
        },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return {
    success: true,
    data: student,
  };
};