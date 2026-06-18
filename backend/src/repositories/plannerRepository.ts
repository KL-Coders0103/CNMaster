import prisma from "../config/prisma";
import { formatLocalDate } from "../utils/dateUtils";

type GetTasksParams = {
    userId: string,
    date?: Date,
};

type UpdateTaskParams = {
    title?: string;
    description?: string;
    dueDate?: Date;
    isCompleted?: boolean;
};

export const createTask = async(userId: string, title: string, description: string | undefined, dueDate: Date) => {
    return prisma.plannerTask.create({
        data:{
            title,
            description,
            dueDate,
            userId,
        },
    });
};

export const getTasks = async({ userId, date}: GetTasksParams) => {
    const whereClause = date ? {
        userId,
        dueDate: {
            gte: new Date(date.setHours(0, 0,0, 0,)),
            lte: new Date(date.setHours(23, 59, 59,999)),
        },
    } : {
        userId,
    };

    return prisma.plannerTask.findMany({
        where: whereClause,
        orderBy: [
            { dueDate: 'asc'},
            { createdAt: 'desc'}
        ]
    })
};

export const getTaskById = async(taskId: string, userId: string) => {
    return prisma.plannerTask.findFirst({
        where: {
            id: taskId,
            userId,
        }
    })
};

export const updateTask = async(taskId: string, data:UpdateTaskParams) => {
    return prisma.plannerTask.update({
        where: {
            id:taskId,
        },
        data,
    })
};

export const toggleTask = async(taskId:string, isCompleted: boolean) => {
    return prisma.plannerTask.update({
        where: {
            id: taskId,
        },
        data:{
            isCompleted,
            completedAt: isCompleted ? new Date() : null
        }
    })
};

export const deleteTask = async(taskId: string) => {
    return prisma.plannerTask.delete({
        where: {
            id:taskId,
        }
    })
};

export const getTaskDates = async(userId: string) => {
    const tasks = await prisma.plannerTask.findMany({
        where: {
            userId,
        },

        select: {
            dueDate: true,
        },
    });

    return tasks.map(
        task =>
            formatLocalDate(
            task.dueDate
            )
        );
};

export const getCompletedTasksCount = async (userId: string) => {
    return prisma.plannerTask.count({
        where: {
            userId,
            isCompleted: true,
        }
    });
};

export const getCompletedTaskDates = async (userId: string) => {
    return prisma.plannerTask.findMany({
        where: {
            userId,
            isCompleted: true,
            completedAt: {not: null},
        },
        select: {completedAt: true},
        orderBy: {completedAt: "asc"},
    });
};