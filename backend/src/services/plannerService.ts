import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { formatLocalDate } from "../utils/dateUtils";
import { CreatePlannerTaskInput, UpdatePlannerTaskInput } from "../validations/plannerValidation";


import { XP_REWARDS } from "../constants/xpConstants";
import { checkConsistentPlannerAchievement, checkTaskAchievements, unlockEarlybirdAchievement, unlockFirstTaskAchievement, unlockNightOwlAchievement } from "./achievementService";
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

  await awardXp(userId, XP_REWARDS.TASK_CREATED, "TASK_CREATED", task.id);
  await unlockFirstTaskAchievement(userId);

  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) {
    await unlockEarlybirdAchievement(userId);
  } else if (hour >= 23 || hour < 2) {
    await unlockNightOwlAchievement(userId);
  }

  return { success: true, message: "Task created successfully", data: task };
};

export const getPlannerTasks = async (userId: string, dateString?: string) => {
  let whereClause: any = { userId };

  if (dateString) {
    const startDate = new Date(dateString);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateString);
    endDate.setHours(23, 59, 59, 999);
    
    whereClause.dueDate = { gte: startDate, lte: endDate };
  }

  const tasks = await prisma.plannerTask.findMany({
    where: whereClause,
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
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

  const isNowCompleted = !existingTask.isCompleted;

  const updatedTask = await prisma.plannerTask.update({
    where: { id: taskId },
    data: {
      isCompleted: isNowCompleted,
      completedAt: isNowCompleted ? new Date() : null,
    },
  });

  if (isNowCompleted) {
    const alreadyRewarded = await hasXpTransaction(userId, "TASK_COMPLETED", taskId);

    if (!alreadyRewarded) {
      await awardXp(userId, XP_REWARDS.TASK_COMPLETED, "TASK_COMPLETED", taskId);
    }

    await recalculateUserStreak(userId);
    await checkTaskAchievements(userId);
    await checkConsistentPlannerAchievement(userId);
  }

  return {
    success: true,
    message: isNowCompleted ? "Task marked as completed" : "Task marked as pending",
    data: updatedTask,
  };
};

export const deletePlannerTask = async (taskId: string, userId: string) => {
  const existingTask = await prisma.plannerTask.findFirst({ where: { id: taskId, userId } });

  if (!existingTask) throw new AppError("Task not found", 404);

  await prisma.plannerTask.delete({ where: { id: taskId } });

  return { success: true, message: "Task deleted successfully" };
};

export const getPlannerCalendarDates = async (userId: string) => {
  const tasks = await prisma.plannerTask.findMany({
    where: { userId },
    select: { dueDate: true },
  });

  const uniqueDates = [...new Set(tasks.map((task) => formatLocalDate(task.dueDate)))];

  return {
    success: true,
    message: "Calendar dates fetched successfully",
    data: uniqueDates,
  };
};