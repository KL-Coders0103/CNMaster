import { api } from "../api/axios"

export const getProfile = async () => {
    const response = await api.get("/profile");

    return response.data;
};

export const updateProfile = async(payload: {
    fullName?:string;
    mobileNumber?: string;
    year?: string;
    branch?: string;
    section?: String;
}) => {
    const response = await api.patch("/profile", payload);

    return response.data;
};

export const getProfileAnalytics = async () => {
    const response = await api.get("/profile/analytics");

    return response.data;
};

export const getProfileStreak = async () => {
    const response = await api.get("/profile/streak");

    return response.data;
};

export const getAchievements = async () => {
    const response = await api.get("/profile/achievements");

    return response.data;
};

export const getAchievementSummary = async () => {
    const response = await api.get("/profile/achievement-summary");

    return response.data;
};

export const getLeaderboard = async () => {
    const response = await api.get("/profile/leaderboard");

    return response.data;
};

export const getActivityHistory = async () => {
    const response = await api.get("/profile/activity-history");

    return response.data;
};

export const getProfileCompletion = async () => {
    const response = await api.get("/profile/completion");

    return response.data;
};

export const getProfileSettings = async () => {
    const response = await api.get("/profile/settings");

    return response.data;
};

export const updateProfileSettings = async (payload: {
    notificationEnabled?: boolean;
    reminderEnabled?: boolean;
    darkMode?: boolean;
}) => {
    const response = await api.patch("/profile/settings", payload);

    return response.data;
};

export const uploadAvatar = async(formData: FormData) => {
    const response = await api.post("/profile/avatar", formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const removeAvatar = async () => {
    const response = await api.delete("/profile/avatar");

    return response.data;
};

export const changePassword = async(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    const response = await api.patch("/profile/change-password", payload);

    return response.data;
};

export const deleteAccount = async(passowrd: string) => {
    const response = await api.delete("/profile", {
        data: {
            passowrd
        },
    });

    return response.data;
};