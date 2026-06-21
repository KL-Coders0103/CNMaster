import prisma from "../config/prisma";

export const getWeeklyAnalyticsData =
  async (
    studentId: string
  ) => {

    const today =
      new Date();

    const startOfWeek =
      new Date(today);

    startOfWeek.setDate(
      today.getDate() -
      today.getDay()
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0
    );

    const endOfWeek =
      new Date(startOfWeek);

    endOfWeek.setDate(
      startOfWeek.getDate() + 6
    );

    endOfWeek.setHours(
      23,
      59,
      59,
      999
    );

    // Notes read this week

    const notesRead =
      await prisma.userReadingProgress.count({
        where: {
          userId: studentId,

          updatedAt: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
      });

    // Assignments submitted this week

    const assignmentsSubmitted =
      await prisma.assignmentSubmission.count({
        where: {
          studentId,

          submittedAt: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
      });

    // XP earned this week

    const xpTransactions =
      await prisma.xpTransaction.findMany({
        where: {
          userId: studentId,

          createdAt: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },

        select: {
          xpEarned: true,
        },
      });

    const xpEarned =
      xpTransactions.reduce(
        (sum, transaction) =>
          sum + transaction.xpEarned,
        0
      );

    // Weekly trend (Sun -> Sat)

    const weeklyTrend =
      [0, 0, 0, 0, 0, 0, 0];

    const readingActivities =
      await prisma.userReadingProgress.findMany({
        where: {
          userId: studentId,

          updatedAt: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },

        select: {
          updatedAt: true,
        },
      });

    readingActivities.forEach(
      activity => {

        const day =
          activity.updatedAt.getDay();

        weeklyTrend[day] += 1;
      }
    );

    // Approximate study hours

    const studyHours =
      Math.max(
        1,
        Math.round(
          notesRead * 0.5
        )
      );

    return {
      studyHours,

      xpEarned,

      notesRead,

      assignmentsSubmitted,

      weeklyTrend,
    };
  };

  export const getConsistencyHeatmap =
  async (
    userId: string
  ) => {

    const thirtyDaysAgo =
      new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 30
    );

    const activities =
      await prisma.dailyActivity.findMany({
        where: {
          userId,

          date: {
            gte: thirtyDaysAgo,
          },
        },

        select: {
          date: true,
          xpGained: true,
        },

        orderBy: {
          date: "asc",
        },
      });

    return activities.map(
      activity => ({
        date: activity.date,

        intensity:
          activity.xpGained >= 120
            ? 4
            : activity.xpGained >= 60
            ? 3
            : activity.xpGained >= 30
            ? 2
            : activity.xpGained > 0
            ? 1
            : 0,
      })
    );
  };

  export const getRecentActivities =
  async (
    userId: string
  ) => {

    const [
      readingActivities,
      xpActivities,
      submissions,
      achievements,
    ] = await Promise.all([

      prisma.userReadingProgress.findMany({
        where: {
          userId,
        },

        orderBy: {
          updatedAt: "desc",
        },

        take: 3,

        include: {
          note: true,
        },
      }),

      prisma.xpTransaction.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 3,
      }),

      prisma.assignmentSubmission.findMany({
        where: {
          studentId: userId,
        },

        orderBy: {
          submittedAt: "desc",
        },

        take: 3,

        include: {
          assignment: true,
        },
      }),

      prisma.userAchievement.findMany({
        where: {
          userId,
        },

        orderBy: {
          unlockedAt: "desc",
        },

        take: 3,

        include: {
          achievement: true,
        },
      }),
    ]);

    const activities = [

      ...readingActivities.map(
        item => ({
          id: item.id,

          action:
            `Read "${item.note.title}" note`,

          createdAt:
            item.updatedAt,
        })
      ),

      ...xpActivities.map(
        item => ({
          id: item.id,

          action:
            `Earned ${item.xpEarned} XP from ${item.source}`,

          createdAt:
            item.createdAt,
        })
      ),

      ...submissions.map(
        item => ({
          id: item.id,

          action:
            `Submitted "${item.assignment.title}" assignment`,

          createdAt:
            item.submittedAt,
        })
      ),

      ...achievements.map(
        item => ({
          id: item.id,

          action:
            `Unlocked "${item.achievement.title}" achievement`,

          createdAt:
            item.unlockedAt,
        })
      ),
    ];

    return activities
      .sort(
        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime()
      )
      .slice(0, 10);
  };