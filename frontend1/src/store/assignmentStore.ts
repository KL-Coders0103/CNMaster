import { create } from "zustand";

import {
  Assignment,
  AssignmentDetail,
  SubmissionHistory,
} from "../types/assignment";

import {
  getAssignments,
  getAssignmentDetails,
  submitAssignment,
  getSubmissionHistory,
  getUpcomingAssignment,
  getAssignmentAnalytics,
} from "../services/assignmentService";

interface AssignmentState {

  assignments:
    Assignment[];

  assignment:
    AssignmentDetail | null;

  search: string;

  isLoading: boolean;

  selectedStatus: string;

  setSelectedStatus: (
    status: string
  ) => void;

  fetchAssignments:
    () => Promise<void>;

  fetchAssignmentDetails:
    (
      id: string
    ) => Promise<void>;

  upcomingAssignment:
  Assignment | null;

fetchUpcomingAssignment:
  () => Promise<void>;

  submitStudentAssignment:
    (
      assignmentId: string,
      file: any
    ) => Promise<void>;

  setSearch:
    (
      value: string
    ) => void;

  submissionHistory:
    SubmissionHistory[];

  fetchSubmissionHistory:
    () => Promise<void>;

  assignmentAnalytics: {
    completed: number;
    pending: number;
    averageMarks: number;
    submissionRate: number;
  } | null;

  fetchAssignmentAnalytics:
    () => Promise<void>;
}

export const useAssignmentStore =
  create<AssignmentState>(
    (set, get) => ({

      assignments: [],

      assignment: null,

      search: "",

      isLoading: false,

      submissionHistory: [],

      selectedStatus: "ALL",

      upcomingAssignment: null,

      assignmentAnalytics: null,

      setSelectedStatus:
        status =>
          set({
            selectedStatus: status,
          }),

      setSearch:
        value =>
          set({
            search: value,
          }),

      fetchAssignments:
        async () => {

          try {

            set({
              isLoading: true,
            });

            const response =
              await getAssignments(
                undefined,
                get().search
              );

            set({
              assignments:
                response.data || [],
            });

          } finally {

            set({
              isLoading: false,
            });
          }
        },

        fetchUpcomingAssignment:
          async () => {

            const response =
              await getUpcomingAssignment();

            set({
              upcomingAssignment:
                response.data,
            });
          },

      fetchAssignmentDetails:
        async id => {

          try {

            set({
              isLoading: true,
            });

            const response =
              await getAssignmentDetails(
                id
              );

            set({
              assignment:
                response.data || [],
            });

          } finally {

            set({
              isLoading: false,
            });
          }
        },

        submitStudentAssignment:
          async (
            assignmentId,
            file
          ) => {

            try {

              set({
                isLoading: true,
              });

              await submitAssignment(
                assignmentId,
                file
              );

              await get()
                .fetchAssignmentDetails(
                  assignmentId
                );

            } finally {

              set({
                isLoading: false,
              });
            }
          },

        fetchAssignmentAnalytics:
          async () => {

            const response =
              await getAssignmentAnalytics();

            set({
              assignmentAnalytics:
                response.data,
            });
          },

        fetchSubmissionHistory:
          async () => {

            try {

              set({
                isLoading: true,
              });

              const response =
                await getSubmissionHistory();

              set({
                submissionHistory:
                  response.data,
              });

            } finally {

              set({
                isLoading: false,
              });
            }
          },
    }));