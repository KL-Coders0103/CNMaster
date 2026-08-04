export enum UserRole {
  student = 'student',
  teacher = 'teacher',
  admin = 'admin',
  superadmin = 'superadmin',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  isSuspended: boolean;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  year?: string | null;
  branch?: string | null;
  section?: string | null;
}

export interface PlannerTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface WeakArea {
  id: string;
  chapterId: string;
  title: string;
  mistakeCount: number;
}

export interface DashboardData {
  user: { fullName: string };
  streak: { days: number };
  xp: {
    totalXp: number;
    current: number;
    required: number;
    level: number;
  };
  tasks: PlannerTask[];
  continueLearning: {
    moduleName: string;
    progress: number;
  } | null;
  weakAreas: WeakArea[];
  recommendedReview: {
    chapterId: string;
    topic: string;
    message: string;
  } | null;
  notificationsCount: number;
  upcomingAssessment: {
    id: string;
    title: string;
    type: 'Quiz' | 'Assignment';
    dueDate: string;
  } | null;
  activityHeatmap: { date: string; xp: number }[];
  achievement: {
    id: string;
    title: string;
    description: string;
    xp: number;
  } | null;
  motivation: {
    text: string;
    author: string;
  } | string;
}

export interface PlannerTask {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  isCompleted: boolean;
}

export interface ProfileAnalytics {
  level: number;
  currentXp: number;
  xpRequired: number;
  currentStreak: number;
  achievementsUnlocked: number;
  tasksCompleted: number;
  totalXpEarned: number;
}

export interface ProfileAchievementSummary {
  totalAchievements: number;
  unlockedAchievements: number;
  lockedAchievements: number;
  completionPercentage: number;
}

export interface LeaderboardSummary {
  currentUserRank: number | null;
  topUsers: any[]; 
}

export interface Chapter {
  id: string;
  title: string;
  description?: string | null;
}

export interface NoteSummary {
  id: string;
  title: string;
  description: string | null;
  views: number;
  downloads: number;
  chapter: string;
}

export interface RecentNoteProgress {
  userId: string;
  noteId: string;
  currentPage: number;
  totalPages: number;
  isCompleted: boolean;
  lastOpenedAt: string;
  note: {
    id: string;
    title: string;
    description: string | null;
    chapter: {
      title: string;
    };
  };
}

export interface NoteDetails {
  id: string;
  title: string;
  description: string | null;
  pdfUrl: string;
  views: number;
  downloads: number;
  chapter: string;
  isBookmarked: boolean;
}

export type AssignmentStatus = 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  chapterId: string;
  isPublished: boolean;
  chapter: {
    id: string;
    title: string;
  };
  submissionStatus: AssignmentStatus;
}

export interface AssignmentDetails extends Assignment {
  submittedAt: string | null;
  marksObtained: number | null;
  feedback: string | null;
}

export interface AssignmentAnalytics {
  completed: number;
  pending: number;
  averageMarks: number;
  submissionRate: number;
}

export interface WeeklyAnalytics {
  studyHours: number;
  xpEarned: number;
  notesRead: number;
  assignmentsSubmitted: number;
  weeklyTrend: number[]; 
}

export interface LearningAnalytics {
  strongestChapter: string;
  weakestChapter: string;
  notesCompletion: number;
  averageQuizScore: number;
  learningStreak: number;
}

export interface HeatmapData {
  date: string;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface RecentActivity {
  id: string;
  action: string;
  createdAt: string;
}

export interface WeakArea {
  id: string;
  userId: string;
  chapterId: string;
  mistakeCount: number;
  chapter: {
    id: string;
    title: string;
  };
}

export type QuizDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  difficulty: QuizDifficulty;
  marks: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  difficulty: QuizDifficulty;
  status: 'IN_PROGRESS' | 'COMPLETED';
  score: number | null;
  totalMarks: number | null;
  totalQuestions: number;
  correctAnswers: number | null;
  wrongAnswers: number | null;
  startedAt: string;
  completedAt: string | null;
}

export interface QuizResultAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string | null;
  };
}

export interface QuizResult extends QuizAttempt {
  quizAnswers: QuizResultAnswer[];
  gamification?: {
    xpEarned: number;
    newLevel: number;
    isPerfectScore: boolean;
  };
}

export interface BookmarkedQuestion {
  userId: string;
  questionId: string;
  createdAt: string;
  question: {
    id: string;
    question: string;
    options: string[];
    difficulty: QuizDifficulty;
    marks: number;
    correctAnswer: string;
    explanation: string | null;
    chapter: {
      title: string;
    };
  };
}

export type NotificationType = 'ASSIGNMENT' | 'QUIZ' | 'ACHIEVEMENT' | 'SYSTEM';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface SearchChapter {
  id: string;
  title: string;
  description: string | null;
}

export interface SearchNote {
  id: string;
  title: string;
  description: string | null;
  chapter: {
    title: string;
  };
}

export interface SearchAssignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  chapter: {
    title: string;
  };
}

export interface SearchResults {
  chapters: SearchChapter[];
  notes: SearchNote[];
  assignments: SearchAssignment[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIFlashcard {
  front: string;
  back: string;
}

export interface SmartPlannerTask {
  title: string;
  description: string;
  dueDate: string;
}