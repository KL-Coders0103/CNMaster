import prisma from "../config/prisma";

export const getDashboardData = async (userId: string) => {
  const today = new Date();
  
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate()-89);
  ninetyDaysAgo.setHours(0, 0, 0, 0);

  const userBase = await prisma.user.findUnique({
    where: { id: userId },
    select: { year: true, branch: true }
  });


  const [user, notificationsCount, weakAreas, upcomingAssessment, dailyActivities] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        userStats: { 
          select: { 
            streakDays: true, 
            xpCurrent: true, 
            xpRequired: true, 
            level: true 
          } 
        },
        learningProgress: { 
          select: { 
            moduleName: true, 
            progress: true 
          }, 
          orderBy: { lastAccessedAt: 'desc' }, 
          take: 1 
        },
        plannerTasks: { 
          where: { 
            dueDate: { 
              gte: startOfDay, 
              lte: endOfDay 
            },
            isCompleted: false, 
          },
          take: 5, 
          orderBy: { dueDate: 'asc' }, 
          select: { 
            id: true, 
            title: true, 
            isCompleted: true 
          } 
        }
      }
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.weakArea.findMany({
      where: {
        userId,
      },

      include: {
        chapter: {
          select: {
            id: true,
            title: true,
          },
        },
      },

      orderBy: {
        mistakeCount: "desc",
      },

      take: 5,
    }),
    prisma.assessment.findFirst({
      where: {
        dueDate: { gt: new Date() },
        OR: [
          { targetYear: userBase?.year, targetBranch: userBase?.branch },
          { targetYear: null, targetBranch: null }
        ]
      },
      orderBy: { dueDate: 'asc' }
    }),
    prisma.dailyActivity.findMany({
      where: { userId, date: { gte: ninetyDaysAgo } },
      orderBy: { date: 'asc' }
    })
  ]);

  return {
    ...user,
    notificationsCount,
    weakAreas: weakAreas.map(
      wa => ({
        id: wa.id,

        chapterId:
          wa.chapterId,

        title:
          wa.chapter.title,

        mistakeCount:
          wa.mistakeCount,
      })
    ),
    upcomingAssessment,
    dailyActivities 
  };
};