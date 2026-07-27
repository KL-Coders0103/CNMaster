import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export const fetchNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return { success: true, data: notifications };
};

export const markAsRead = async (id: string, userId: string) => {
  const result = await prisma.notification.updateMany({ 
    where: { id, userId }, 
    data: { isRead: true } 
  });

  if(result.count === 0) {
    throw new AppError("Notificationn not found or unauthorized", 404);
  }
  
  return { success: true, message: "Notification read" };
};

export const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return { success: true, message: "All notifications marked as read" };
};