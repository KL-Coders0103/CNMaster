import { AppError } from "../utils/AppError";

import {
  createSubmission,
  getAssignmentAnalytics,
  getAssignmentById,
  getAssignments,
  getStudentSubmission,
  getStudentSubmissionHistory,
  getUpcomingAssignment,
  updateSubmission,
} from "../repositories/assignmentRepository";

export const fetchAssignments =
  async (
    studentId: string,

    chapterId?: string,

    search?: string
  ) => {

    const assignments =
      await getAssignments({
        chapterId,
        search,
      }, studentId);

    const formattedAssignments =
  assignments.map(
    assignment => ({

      ...assignment,

      submissionStatus:
        assignment.submissions?.[0]
          ?.status ??
        (
          new Date(
            assignment.dueDate
          ) < new Date()

            ? "OVERDUE"

            : "PENDING"
        ),
    })
  );


    return {
      success: true,
      message:
        "Assignments fetched successfully",

      data: formattedAssignments,
    };
  };

export const fetchAssignmentDetails =
  async (
    assignmentId: string,
    studentId: string
  ) => {

    const assignment =
      await getAssignmentById(
        assignmentId
      );

    if (!assignment) {
      throw new AppError(
        "Assignment not found",
        404
      );
    }

    const submission =
      await getStudentSubmission(
        assignmentId,
        studentId
      );

    return {
      success: true,

      data: {
        ...assignment,

        submissionStatus:
          submission?.status ??
          "PENDING",

        submittedAt:
          submission?.submittedAt ??
          null,

        marksObtained:
          submission?.marksObtained ??
          null,

        feedback:
          submission?.feedback ??
          null,
      },
    };
  };

export const submitAssignment =
  async (
    assignmentId: string,
    studentId: string,
    submissionUrl: string
  ) => {

    const assignment =
      await getAssignmentById(
        assignmentId
      );

    if (!assignment) {
      throw new AppError(
        "Assignment not found",
        404
      );
    }

    const existingSubmission =
      await getStudentSubmission(
        assignmentId,
        studentId
      );

    const isLateSubmission =
      new Date() >
      assignment.dueDate;

    if (
      existingSubmission
    ) {

      await updateSubmission(
        assignmentId,
        studentId,
        submissionUrl,
        isLateSubmission
      );

    } else {

      await createSubmission(
        assignmentId,
        studentId,
        submissionUrl,
        isLateSubmission
      );
    }

    return {
      success: true,
      message:
        "Assignment submitted successfully",
    };
  };

  export const fetchSubmissionHistory =
  async (
    studentId: string
  ) => {

    const history =
      await getStudentSubmissionHistory(
        studentId
      );

    return {
      success: true,
      message:
        "Submission history fetched successfully",

      data: history,
    };
  };

  export const fetchUpcomingAssignment =
  async (
    studentId: string
  ) => {

    const assignment =
      await getUpcomingAssignment(
        studentId
      );

    return {
      success: true,
      data: assignment,
    };
  };

  export const fetchAssignmentAnalytics =
  async (
    studentId: string
  ) => {

    const analytics =
      await getAssignmentAnalytics(
        studentId
      );

    return {
      success: true,
      data: analytics,
    };
  };