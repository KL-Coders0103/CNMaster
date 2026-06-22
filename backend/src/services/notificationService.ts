import prisma from "../config/prisma";

export const fetchNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return { success: true, data: notifications };
};

export const markAsRead = async (id: string) => {
  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  return { success: true, message: "Notification read" };
};

export const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return { success: true, message: "All notifications marked as read" };
};