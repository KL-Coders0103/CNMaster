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

  fileType: string;

  createdAt: string;

  submissionStatus?:
    AssignmentStatus;

  chapter: {
    id: string;
    title: string;

    subject: {
      id: string;
      name: string;
    };
  };
}

export interface AssignmentDetail
  extends Assignment {

  submissionStatus:
    AssignmentStatus;

  submittedAt?: string | null;

  marksObtained?:
    number | null;

  feedback?:
    string | null;
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
      subject: {
        name: string;
      };
    };
  };
}