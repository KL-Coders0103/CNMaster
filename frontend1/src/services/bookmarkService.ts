import { api } from "../api/axios";

export const getBookmarks = async () => {
  const response = await api.get("/bookmarks");
  return response.data;
};

export const toggleBookmark = async (questionId: string) => {
  const response = await api.post(`/bookmarks/${questionId}`);
  return response.data;
};