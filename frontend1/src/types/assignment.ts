// 1. Added the precise file types based on your backend Prisma schema
export type AssignmentFileType = 
  | "PDF" 
  | "DOCX" 
  | "IMAGE" 
  | "ZIP" 
  | "OTHER";

export type AssignmentStatus =
  | "PENDING"
  | "SUBMITTED"
  | "REVIEWED"
  | "REJECTED"
  | "RESUBMISSION_REQUIRED"
  | "OVERDUE";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
  totalMarks: number;
  assignmentUrl: string;
  fileType: AssignmentFileType; // <-- Strictly typed
  createdAt: string;
  submissionStatus?: AssignmentStatus;
  chapter: {
    id: string;
    title: string;
    // <-- CRITICAL FIX: Subject relation removed completely
  };
}

export interface AssignmentDetail extends Assignment {
  submissionStatus: AssignmentStatus;
  submittedAt?: string | null;
  marksObtained?: number | null;
  feedback?: string | null;
}

export interface SubmissionHistory {
  id: string;
  status: AssignmentStatus;
  submittedAt: string;
  marksObtained?: number | null;
  feedback?: string | null;
  assignment: {
    title: string;
    totalMarks: number;
    chapter: {
      title: string;
      // <-- CRITICAL FIX: Subject relation removed completely
    };
  };
}