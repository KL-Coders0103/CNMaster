import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

let dashboardCache: { data: any, timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const getOverallDashboardStats = async () => {
  const now = Date.now();

  if (dashboardCache && (now - dashboardCache.timestamp) < CACHE_TTL_MS) {
    return { success: true, data: dashboardCache.data };
  }

  const [
    totalStudents,
    suspendedStudents,
    totalQuizzesTaken,
    totalAssignmentsSubmitted,
    averageScoreAgg
  ] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { isSuspended: true } }),
    prisma.quizAttempt.count(),
    prisma.assignmentSubmission.count(),
    prisma.quizAttempt.aggregate({ _avg: { score: true } })
  ]);

  const stats = {
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
  };
  dashboardCache = { data: stats, timestamp: now };

  return { success: true, data: stats };
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
        select: { level: true, xpCurrent: true, streakDays: true },
      },
    },
    orderBy: { userStats: { xpCurrent: "desc" } },
    take: limit,
  });

  return { success: true, data: topStudents };
};

export const getIndividualStudentAnalytics = async (userId: string) => {
  const student = await prisma.user.findUnique({
    where: {
      id: userId
    },
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
          totalMarks: true,
          totalQuestions: true,
          correctAnswers: true,
          wrongAnswers: true,
          difficulty: true,
          status: true,
          startedAt: true,
          completedAt: true
        },
        orderBy: {
          startedAt: "desc"
        },
        take: 15
      },
      readingProgress: {
        select: {
          lastOpenedAt: true,
          currentPage: true, 
          totalPages: true,  
          isCompleted: true,
          note: {
            select: {
              title: true,
              chapter: {
                select: {
                  title: true
                }
              }
            }
          }
        },
        orderBy: {
          lastOpenedAt: "desc"
        },
        take: 15
      },
      assignmentSubmissions: { 
        select: {
          status: true,
          submittedAt: true,
          marksObtained: true,
          assignment: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          submittedAt: "desc"
        },
        take: 15
      }
    }
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return {
    success: true,
    data: student
  };
};