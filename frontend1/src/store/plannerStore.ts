import { create } from "zustand";
import { CreatePlannerTaskPayload, PlannerTask, UpdatePlannerTaskPayload } from "../types/planner"
import { createPlannerTask, deletePlannerTask, getPlannerCalendarDates, getPlannerTasks, togglePlannerTask, updatePlannerTask } from "../services/plannerService";
import { useDashboardStore } from "./dashboardStore";

type PlannerState = {
    tasks: PlannerTask[];
    isLoading: boolean;
    error: string | null;
    selectedDate: string | null;
    calendarDates: string[];
    openAddTaskModal: boolean;
    setOpenAddTaskModal: (value: boolean) => void;
    fetchCalendarDates: () => Promise<void>;
    setSelectedDate: (date: string) => void;
    fetchTasks: (date?: string) => Promise<void>;
    createTask: (payload: CreatePlannerTaskPayload) => Promise<void>;
    updateTask: (taskId: string, payload: UpdatePlannerTaskPayload) => Promise<void>;
    toggleTask: (taskId: string) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    refreshTasksAndCalendarDates: () => Promise<void>;
    clearTasks: () => void;
};

export const usePlannerStore = create<PlannerState>(
    (set, get) => ({
        tasks: [],
        isLoading: false,
        error: null,
        selectedDate: null,
        calendarDates: [],
        openAddTaskModal: false,
        setOpenAddTaskModal: (value) => set({
            openAddTaskModal: value,
        }),
        setSelectedDate: (date) => set({
            selectedDate: date,
        }),

        fetchTasks: async(date) => {
            try {
                set({
                    isLoading: true,
                    error: null,
                    selectedDate: date ?? null,
                });

                const response  = await getPlannerTasks(date);

                set({
                    tasks: response.data,
                    isLoading: false,
                });
            } catch ( error: any) {
                set({
                    error: error?.response?.data?.message ?? "Failed to fetch tasks",
                    isLoading: false,
                });
            }
        },

        refreshTasksAndCalendarDates: async () => {
            const currentDate = get().selectedDate;
            const taskResponse = await getPlannerTasks(currentDate ?? undefined);
            const calendarResponse = await getPlannerCalendarDates();

            set({
                tasks: taskResponse.data,
                calendarDates: calendarResponse.data,
            });
            await useDashboardStore.getState().fetchDashboard();
        },

        createTask: async(payload) => {
            await createPlannerTask(payload);
            await get().refreshTasksAndCalendarDates();            
        },

        updateTask: async(taskId, payload) => {
            await updatePlannerTask(taskId, payload);
            await get().refreshTasksAndCalendarDates(); 
        },

        toggleTask: async(taskId) => {
            await togglePlannerTask(taskId);
            await get().refreshTasksAndCalendarDates(); 
        },

        deleteTask: async(taskId) => {
            await deletePlannerTask(taskId);
            await get().refreshTasksAndCalendarDates(); 
        },

        fetchCalendarDates: async () => {
            try {
                const response = await getPlannerCalendarDates();

                set({
                    calendarDates: response.data,
                });
            } catch (error) {
                console.log("Calendar dates error", error);
            }
        },

        clearTasks: () => set({
            tasks: [],
            error: null,
        }),
    })
);