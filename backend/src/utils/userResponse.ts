import { User } from "@prisma/client";

export const toPublicUser = (user: User) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    avatarUrl: user.avatarUrl,
    year: user.year,
    branch: user.branch,
    section: user.section,
    role: user.role,
    provider: user.provider,
    isEmailVerified: user.isEmailVerified,
    isProfileCompleted: user.isProfileCompleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});