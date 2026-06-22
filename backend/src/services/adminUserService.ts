import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { UserRole } from "@prisma/client";

interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  year?: string;
  branch?: string;
  section?: string;
}

export const getAllUsers = async (params: GetUsersParams) => {
  const { page, limit, search, year, branch, section } = params;
  const skip = (page - 1) * limit;

  const whereClause: any = {
    ...(year && { year }),
    ...(branch && { branch }),
    ...(section && { section }),
  };

  if (search) {
    whereClause.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { mobileNumber: { contains: search } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        mobileNumber: true,
        role: true,
        isSuspended: true,
        year: true,
        branch: true,
        section: true,
        createdAt: true,
        userStats: {
          select: { level: true, xpCurrent: true, streakDays: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return {
    success: true,
    data: {
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
  };
};

export const toggleSuspension = async (userId: string, isSuspended: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) throw new AppError("User not found", 404);
  if (user.role === "admin") throw new AppError("Cannot suspend an administrator", 403);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isSuspended },
    select: { id: true, fullName: true, isSuspended: true }
  });

  // Note: Since we updated the login function previously, 
  // suspended users will immediately be blocked upon their next login attempt.
  // If you implement WebSockets later, you can force-logout them here.

  return {
    success: true,
    message: `User has been successfully ${isSuspended ? "suspended" : "unsuspended"}`,
    data: updatedUser,
  };
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) throw new AppError("User not found", 404);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, fullName: true, role: true }
  });

  return {
    success: true,
    message: `User role successfully updated to ${newRole}`,
    data: updatedUser,
  };
};