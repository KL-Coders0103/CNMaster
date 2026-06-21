import { api } from "../api/axios";

export const getAssignments =
  async (
    chapterId?: string,
    search?: string
  ) => {

    const response =
      await api.get(
        "/assignments",
        {
          params: {
            chapterId,
            search,
          },
        }
      );

    return response.data;
  };

export const getAssignmentDetails =
  async (
    assignmentId: string
  ) => {

    const response =
      await api.get(
        `/assignments/${assignmentId}`
      );

    return response.data;
  };

export const submitAssignment =
  async (
    assignmentId: string,
    file: any
  ) => {

    const formData =
      new FormData();

    formData.append(
      "submission",
      {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      } as any
    );

    const response =
      await api.post(
        `/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const getSubmissionHistory = async () => {
  const response = await api.get("/assignments/history/me");

  return response.data;
};

export const getUpcomingAssignment =
  async () => {

    const response =
      await api.get(
        "/assignments/upcoming/me"
      );

    return response.data;
  };

export const getAssignmentAnalytics =
  async () => {

    const response =
      await api.get(
        "/assignments/analytics"
      );

    return response.data;
  };