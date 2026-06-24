import { api } from "../api/axios";
import { CreatePlannerTaskPayload, PlannerCalendarResponse, PlannerResponse, UpdatePlannerTaskPayload } from "../types/planner";

export const getPlannerTasks = async(date?: string): Promise<PlannerResponse> => {
    const response = await api.get("/planner/tasks", {
        params: { date }
    });
    return response.data;
};

export const createPlannerTask = async(payload: CreatePlannerTaskPayload) => {
    const response = await api.post("/planner/tasks", payload);
    return response.data;
};

export const updatePlannerTask = async(taskId: string, payload: UpdatePlannerTaskPayload) => {
    const response = await api.patch(`/planner/tasks/${taskId}`, payload);
    return response.data;
};

export const togglePlannerTask = async(taskId: string) => {
    const response = await api.patch(`/planner/tasks/${taskId}/toggle`);
    return response.data;
};

export const deletePlannerTask = async(taskId: string) => {
    const response = await api.delete(`/planner/tasks/${taskId}`);
    return response.data;
};

export const getPlannerCalendarDates = async (): Promise<PlannerCalendarResponse> => {
    const response =  await api.get("/planner/calendar");
    return response.data;
};