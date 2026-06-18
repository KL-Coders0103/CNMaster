export type PlannerTask = {
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type PlannerResponse = {
    success: boolean;
    message: string;
    data: PlannerTask[];
};

export type CreatePlannerTaskPayload = {
    title: string;
    description?: string;
    dueDate: string;
};

export type UpdatePlannerTaskPayload  = {
    title: string;
    description?: string;
    dueDate: string;
    isCompleted?: boolean;
};

export type PlannerCalendarResponse ={
    success: boolean;
    message: string;
    data: string[];
};

