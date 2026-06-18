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
      totalXp: number;
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

    weakAreas: string[]; 

    recommendedReview: {
      topic: string;
      message: string;
    } | null;

    notificationsCount: number;

    achievement: {
      id: string;
      title: string;
      description: string;
      xp: number;
    } | null;

    upcomingAssessment: {
      id: string;
      title: string;
      type: "Quiz" | "Exam" | "Assignment";
      dueDate: string; 
    } | null;

    activityHeatmap: {
      date: string;
      xp: number;
    }[];

    motivation: {
      text: string;
      author: string;
    }
  };
}