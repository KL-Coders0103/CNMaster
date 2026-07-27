import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { formatLocalDate } from "../utils/dateUtils";
import { CreatePlannerTaskInput, UpdatePlannerTaskInput } from "../validations/plannerValidation";
import { XP_REWARDS } from "../constants/xpConstants";
import { 
  checkConsistentPlannerAchievement, 
  checkTaskAchievements, 
  unlockEarlybirdAchievement, 
  unlockFirstTaskAchievement, 
  unlockNightOwlAchievement 
} from "./achievementService";
import { recalculateUserStreak } from "./streakService";
import { awardXp, hasXpTransaction } from "./xpService"; 

export const createPlannerTask = async (userId: string, payload: CreatePlannerTaskInput) => {
  const task = await prisma.plannerTask.create({
    data: {
      userId,
      title: payload.title,
      description: payload.description,
      dueDate: new Date(payload.dueDate),
    },
  });

  Promise.all([
    awardXp(userId, XP_REWARDS.TASK_CREATED, "TASK_CREATED", task.id),
    unlockFirstTaskAchievement(userId)
  ]).catch(console.error);

  const hour = new Date().getUTCHours() + 5.5; 
  const normalizedHour = hour >= 24 ? hour - 24 : Math.floor(hour);

  if (normalizedHour >= 5 && normalizedHour < 7) {
    unlockEarlybirdAchievement(userId).catch(console.error);
  } else if (normalizedHour >= 23 || normalizedHour < 2) {
    unlockNightOwlAchievement(userId).catch(console.error);
  }

  return { success: true, message: "Task created successfully", data: task };
};

export const getPlannerTasks = async (userId: string, dateString?: string) => {
  let whereClause: any = { userId };

  if (dateString) {
    const startDate = new Date(dateString);
    startDate.setUTCHours(0, 0, 0, 0);
    
    const endDate = new Date(dateString);
    endDate.setUTCHours(23, 59, 59, 999);
    
    whereClause.dueDate = { gte: startDate, lte: endDate };
  } else {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    whereClause.dueDate = { gte: today, lte: thirtyDaysFromNow };
  }

  const tasks = await prisma.plannerTask.findMany({
    where: whereClause,
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  });

  return { success: true, message: "Tasks fetched successfully", data: tasks };
};

export const updatePlannerTask = async (taskId: string, userId: string, payload: UpdatePlannerTaskInput) => {
  const existingTask = await prisma.plannerTask.findFirst({ where: { id: taskId, userId } });
  if (!existingTask) throw new AppError("Task not found", 404);

  const updatedTask = await prisma.plannerTask.update({
    where: { id: taskId },
    data: {
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    },
  });

  return { success: true, message: "Task updated successfully", data: updatedTask };
};

export const togglePlannerTask = async (taskId: string, userId: string) => {
  const existingTask = await prisma.plannerTask.findFirst({ where: { id: taskId, userId } });
  if (!existingTask) throw new AppError("Task not found", 404);

  const isCompleting = !existingTask.isCompleted;

  try {
    const updatedTask = await prisma.plannerTask.update({
      where: { 
        id: taskId,
        isCompleted: existingTask.isCompleted 
      },
      data: {
        isCompleted: isCompleting,
        completedAt: isCompleting ? new Date() : null,
      },
    });

    if (isCompleting) {
      const alreadyRewarded = await hasXpTransaction(userId, "TASK_COMPLETED", taskId);

      if (!alreadyRewarded) {
        await awardXp(userId, XP_REWARDS.TASK_COMPLETED, "TASK_COMPLETED", taskId);
      }

      Promise.all([
        recalculateUserStreak(userId),
        checkTaskAchievements(userId),
        checkConsistentPlannerAchievement(userId)
      ]).catch(console.error);
    }

    return {
      success: true,
      message: isCompleting ? "Task marked as completed" : "Task marked as pending",
      data: updatedTask,
    };
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new AppError("Task state was already modified.", 409);
    }
    throw error;
  }
};

export const deletePlannerTask = async (taskId: string, userId: string) => {
  const existingTask = await prisma.plannerTask.findFirst({ where: { id: taskId, userId } });
  if (!existingTask) throw new AppError("Task not found", 404);

  await prisma.plannerTask.delete({ where: { id: taskId } });
  return { success: true, message: "Task deleted successfully" };
};

export const getPlannerCalendarDates = async (userId: string, month: number, year: number) => {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const tasks = await prisma.plannerTask.findMany({
    where: { 
      userId,
      dueDate: { gte: startOfMonth, lte: endOfMonth }
    },
    select: { dueDate: true },
  });

  const uniqueDates = [...new Set(tasks.map((task) => formatLocalDate(task.dueDate)))];

  return {
    success: true,
    message: "Calendar dates fetched successfully",
    data: uniqueDates,
  };
};