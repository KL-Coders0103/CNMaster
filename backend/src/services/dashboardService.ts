import { AppError } from "../utils/AppError";
import { getDashboardData } from "../repositories/dashboardRepository";

export const getHomeDashboard = async (userId: string) => {
  const user = await getDashboardData(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  let achievement = null;
  const level = user.userStats?.level ?? 1;
  const tasks = user.plannerTasks ?? []; 
  const progressList = user.learningProgress ?? [];
  const completedTasksCount = tasks.filter(t => t.isCompleted).length;

  const rawActivities = user.dailyActivities ?? [];

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      fullDate: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }) 
    };
  });

  const weeklyActivity = last7Days.map(dayInfo => {
    const record = rawActivities.find(
      a => a.date.toISOString().split('T')[0] === dayInfo.fullDate
    );
    return {
      day: dayInfo.dayName,
      xp: record ? record.xpGained : 0, 
    };
  });

  if (level >= 2) {
    achievement = { title: "Rising Star", description: "You reached Level 2.", xp: 50 };
  } else if (progressList.length > 0 && progressList[0].progress >= 100) {
    achievement = { title: "First Milestone", description: "Completed your first module.", xp: 25 };
  } else if (completedTasksCount >= 5) {
    achievement = { title: "Task Master", description: "Completed 5 tasks.", xp: 20 };
  }

  return {
    success: true,
    message: "Dashboard fetched successfully",
    data: {
      user: { fullName: user.fullName },
      streak: { days: user.userStats?.streakDays ?? 0 },
      xp: {
        current: user.userStats?.xpCurrent ?? 0,
        required: user.userStats?.xpRequired ?? 500,
        level: level,
      },
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.isCompleted,
      })),
      continueLearning: (progressList.length > 0) ? {
        moduleName: progressList[0].moduleName,
        progress: progressList[0].progress,
      } : null,

      weakAreas: user.weakAreas, 

      recommendedReview: user.weakAreas.length > 0 ? {
        topic: user.weakAreas[0],
        message: `You struggle with ${user.weakAreas[0]} recently. Take a quick 3-question review to level up?`
      } : null,

      notificationsCount: user.notificationsCount, 
      
      upcomingAssessment: user.upcomingAssessment ? {
        id: user.upcomingAssessment.id,
        title: user.upcomingAssessment.title,
        type: user.upcomingAssessment.type,
        dueDate: user.upcomingAssessment.dueDate.toISOString(),
      } : null,
      
      weeklyActivity, 
      
      achievement,
    },
  };
};