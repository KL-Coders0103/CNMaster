import prisma from "../config/prisma";

export const broadcastNotification = async (data: {
  title: string;
  message: string;
  targetYear?: string;
  targetBranch?: string;
  targetSection?: string;
}) => {
  const whereClause: any = { role: "student" };
  
  if (data.targetYear) whereClause.year = data.targetYear;
  if (data.targetBranch) whereClause.branch = data.targetBranch;
  if (data.targetSection) whereClause.section = data.targetSection;

  const targetedUsers = await prisma.user.findMany({
    where: whereClause,
    select: { id: true },
  });

  if (targetedUsers.length === 0) {
    return { success: false, message: "No students found matching those criteria." };
  }

  const notificationData = targetedUsers.map((user) => ({
    userId: user.id,
    title: data.title,
    message: data.message,
  }));

  await prisma.notification.createMany({
    data: notificationData,
    skipDuplicates: true, 
  });

  return { 
    success: true, 
    message: `Notification sent successfully to ${targetedUsers.length} students.`,
  };
};