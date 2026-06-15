export interface DashboardResponse {
  success: boolean;
  message: string;

  data: {
    user: {
      fullName: string;
    };

    streak: {
      days: number;
    };

    xp: {
      current: number;
      required: number;
      level: number;
    };

    continueLearning: {
      moduleName: string;
      progress: number;
    } | null;

    tasks: {
      id: string;
      title: string;
      completed: boolean;
    }[];

    weakAreas: [];

    notificationsCount: number;

    achievement: {
      title: string;
      description: string;
      xp: number;
    } | null;
  };
}