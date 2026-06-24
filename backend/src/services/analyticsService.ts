import prisma from "../config/prisma";
import { formatLocalDate } from "../utils/dateUtils";

export const getWeeklyAnalytics = async (userId: string) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const [notesRead, assignmentsSubmitted, xpTransactions, readingActivities] = await Promise.all([
    prisma.userReadingProgress.count({
      where: { userId, updatedAt: { gte: startOfWeek, lte: endOfWeek } },
    }),
    prisma.assignmentSubmission.count({
      where: { studentId: userId, submittedAt: { gte: startOfWeek, lte: endOfWeek } },
    }),
    prisma.xpTransaction.findMany({
      where: { userId, createdAt: { gte: startOfWeek, lte: endOfWeek } },
      select: { xpEarned: true },
    }),
    prisma.userReadingProgress.findMany({
      where: { userId, updatedAt: { gte: startOfWeek, lte: endOfWeek } },
      select: { updatedAt: true },
    })
  ]);

  const xpEarned = xpTransactions.reduce((sum, transaction) => sum + transaction.xpEarned, 0);

  const weeklyTrend = [0, 0, 0, 0, 0, 0, 0];
  readingActivities.forEach((activity) => {
    weeklyTrend[activity.updatedAt.getDay()] += 1;
  });

  const studyHours = Math.max(1, Math.round(notesRead * 0.5));

  return {
    success: true,
    message: "Weekly analytics fetched successfully",
    data: { studyHours, xpEarned, notesRead, assignmentsSubmitted, weeklyTrend },
  };
};

export const getLearningAnalytics = async (userId: string) => {
  const [weakestArea, userStats, totalNotes, readingProgress, averageQuizRaw] = await Promise.all([
    prisma.weakArea.findFirst({
      where: { userId },
      orderBy: { mistakeCount: "desc" },
      include: { chapter: { select: { title: true } } },
    }),
    prisma.userStats.findUnique({ where: { userId }, select: { streakDays: true } }),
    prisma.note.count(),
    prisma.userReadingProgress.findMany({
      where: { userId },
      select: { currentPage: true, totalPages: true },
    }),
    prisma.quizAttempt.aggregate({
      where: { userId, status: "COMPLETED" },
      _avg: { score: true }
    })
  ]);

  const weakestChapter = weakestArea?.chapter?.title || "No data yet";

  const strongestArea = await prisma.quizAttempt.findFirst({
    where: { userId, status: "COMPLETED" },
    orderBy: { score: 'desc' },
    include: { quizAnswers: { include: { question: { include: { chapter: true } } } } }
  });

  const strongestChapter = strongestArea?.quizAnswers[0]?.question?.chapter?.title || "Keep practicing!";

  const completedNotes = readingProgress.filter(
    (progress) => progress.totalPages > 0 && (progress.currentPage / progress.totalPages) >= 0.9
  ).length;

  const notesCompletion = totalNotes === 0 ? 0 : Math.round((completedNotes / totalNotes) * 100);
  const averageQuizScore = averageQuizRaw._avg.score ? Math.round(averageQuizRaw._avg.score) : 0;

  return {
    success: true,
    data: {
      strongestChapter, 
      weakestChapter,  
      notesCompletion,
      averageQuizScore,
      learningStreak: userStats?.streakDays ?? 0,
    },
  };
};

export const getConsistencyHeatmap = async (userId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activities = await prisma.dailyActivity.findMany({
    where: { userId, date: { gte: thirtyDaysAgo } },
    select: { date: true, xpGained: true },
    orderBy: { date: "asc" },
  });

  const heatmap = activities.map((activity) => ({
    date: activity.date,
    intensity:
      activity.xpGained >= 120 ? 4 :
      activity.xpGained >= 60 ? 3 :
      activity.xpGained >= 30 ? 2 :
      activity.xpGained > 0 ? 1 : 0,
  }));

  return { success: true, data: heatmap };
};

export const getRecentActivities = async (userId: string) => {
  const [readingActivities, xpActivities, submissions, achievements] = await Promise.all([
    prisma.userReadingProgress.findMany({
      where: { userId }, orderBy: { updatedAt: "desc" }, take: 3, include: { note: true },
    }),
    prisma.xpTransaction.findMany({
      where: { userId }, orderBy: { createdAt: "desc" }, take: 3,
    }),
    prisma.assignmentSubmission.findMany({
      where: { studentId: userId }, orderBy: { submittedAt: "desc" }, take: 3, include: { assignment: true },
    }),
    prisma.userAchievement.findMany({
      where: { userId }, orderBy: { unlockedAt: "desc" }, take: 3, include: { achievement: true },
    }),
  ]);

  const activities = [
    ...readingActivities.map((item) => ({
      id: item.id,
      action: `Read "${item.note.title}" note`,
      createdAt: item.updatedAt,
    })),
    ...xpActivities.map((item) => ({
      id: item.id,
      action: `Earned ${item.xpEarned} XP from ${item.source}`,
      createdAt: item.createdAt,
    })),
    ...submissions.map((item) => ({
      id: item.id,
      action: `Submitted "${item.assignment.title}" assignment`,
      createdAt: item.submittedAt,
    })),
    ...achievements.map((item) => ({
      id: item.id,
      action: `Unlocked "${item.achievement.title}" achievement`,
      createdAt: item.unlockedAt,
    })),
  ];

  const sortedActivities = activities
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return { success: true, data: sortedActivities };
};

export const getWeakAreas = async (userId: string) => {
  const weakAreas = await prisma.weakArea.findMany({
    where: { userId },
    include: { chapter: true }, 
    orderBy: { mistakeCount: "desc" },
    take: 5,
  });

  return {
    success: true,
    message: "Weak areas fetched successfully",
    data: weakAreas,
  };
};