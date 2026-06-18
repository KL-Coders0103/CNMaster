import { XP_REWARDS } from "../constants/xpConstants";
import { createTask, deleteTask, getTaskById, getTaskDates, getTasks, toggleTask, updateTask } from "../repositories/plannerRepository";
import { hasXpTransaction } from "../repositories/xpRepository";
import { AppError } from "../utils/AppError";
import { CreatePlannerTaskInput, UpdatePlannerTaskInput } from "../validations/plannerValidation";
import { checkConsistentPlannerAchievement, checkTaskAchievements, unlockEarlybirdAchievement, unlockFirstTaskAchievement, unlockNightOwlAchievement } from "./achievementService";
import { recalculateUserStreak } from "./streakService";
import { awardXp } from "./xpService";

export const createPlannerTask = async(userId: string, payload: CreatePlannerTaskInput) => {
    const task = await createTask(userId, payload.title, payload.description, new Date(payload.dueDate));

    await awardXp(userId, XP_REWARDS.TASK_CREATED, "TASK_CREATED", task.id);

    await unlockFirstTaskAchievement(userId);

    const now = new Date();
    const hour = now.getHours();

    if(hour >= 5 && hour < 7) {
        await unlockEarlybirdAchievement(userId);
    }

    if(hour >= 23 || hour < 2) {
        await unlockNightOwlAchievement(userId);
    }
    
    return {
        success: true,
        message: "Task created succesfully",
        data: task,
    }
};

export const getPlannerTask = async(userId: string, date?:string) => {
    const task = await getTasks({userId, date: date ? new Date(date) : undefined});

    return {
        success: true,
        message: "Task fetched succesfully",
        data: task,
    }
};

export const updatePlannerTask = async(taskId: string, userId: string, payload: UpdatePlannerTaskInput) => {
    const existingTask = await getTaskById(taskId, userId);

    if(!existingTask) {
        throw new AppError("Task not found", 404);
    }

    const updatedTask = await updateTask(taskId, {...payload, dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined});

    return {
        success: true,
        message: "Task updated succesfully",
        data: updatedTask,
    }
};

export const togglePlannnerTask = async(taskId:string, userId: string) => {
    const existingTask = await getTaskById(taskId, userId);

    if(!existingTask) {
        throw new AppError("Task not found", 404);
    }

    const updatedTask = await toggleTask(taskId, !existingTask.isCompleted);

    if (updatedTask.isCompleted) {

        const existingReward =
        await hasXpTransaction(
            updatedTask.userId,
            "TASK_COMPLETED",
            updatedTask.id
        );

        if (!existingReward) {

        await awardXp(
            updatedTask.userId,
            XP_REWARDS.TASK_COMPLETED,
            "TASK_COMPLETED",
            updatedTask.id
        );
        }

        await recalculateUserStreak(updatedTask.userId);

        await checkTaskAchievements(updatedTask.userId);

        await checkConsistentPlannerAchievement(updatedTask.userId);
    }
    
    return {
        success: true,
        message: existingTask.isCompleted ? "Task marked as pending" : "Task marked as completed",
        data: updatedTask,
    }
};

export const deletePlannerTask = async(taskId: string, userId: string) => {
    const existingTask = await getTaskById(taskId, userId);

    if(!existingTask) {
        throw new AppError("Task not found", 404);
    }
    
    await deleteTask(taskId);
    
    return {
        success: true,
        message: "Task deleted succesfully",
    }
};

export const getPlannerCalendarDates = async(userId: string) => {
    const dates = await getTaskDates(userId);

    return {
        success: true,
        message: "Calendar dates fetched successfully",
        data: dates,
    }
};