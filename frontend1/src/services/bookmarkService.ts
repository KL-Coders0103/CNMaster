import { api }
from "../api/axios";

export const getBookmarks =
  () =>
    api.get(
      "/bookmarks"
    );

export const toggleBookmark =
  (
    questionId: string
  ) =>
    api.post(
      `/bookmarks/${questionId}`
    );