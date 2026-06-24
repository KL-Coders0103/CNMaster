import { api } from "../api/axios";

export const getChapters = async () => {
  const response = await api.get("/notes/chapters");
  return response.data;
};

export const getNotes = async (search?: string, chapterId?: string) => {
  const response = await api.get("/notes", {
    params: {
      search,
      chapterId,
    },
  });
  return response.data;
};

export const getNoteDetails =
  async (
    noteId: string
  ) => {

    const response =
      await api.get(
        `/notes/${noteId}`
      );

    return response.data;
  };

export const bookmarkNote =
  async (
    noteId: string
  ) => {

    const response =
      await api.post(
        `/notes/${noteId}/bookmark`
      );

    return response.data;
  };

export const removeBookmark =
  async (
    noteId: string
  ) => {

    const response =
      await api.delete(
        `/notes/${noteId}/bookmark`
      );

    return response.data;
  };

export const toggleBookmark =
  async (
    noteId: string,
    bookmarked: boolean
  ) => {

    if (bookmarked) {

      return removeBookmark(
        noteId
      );
    }

    return bookmarkNote(
      noteId
    );
  };

export const saveReadingProgress =
  async (
    noteId: string,
    currentPage: number,
    totalPages: number
  ) => {

    const response =
      await api.post(
        `/notes/${noteId}/progress`,
        {
          currentPage,
          totalPages,
        }
      );

    return response.data;
  };

export const getReadingProgress =
  async (
    noteId: string
  ) => {

    const response =
      await api.get(
        `/notes/${noteId}/progress`
      );

    return response.data;
  };

export const getRecentNotes =
  async () => {

    const response =
      await api.get(
        "/notes/recent"
      );

    return response.data;
  };

export const registerDownload =
  async (
    noteId: string
  ) => {

    const response =
      await api.post(
        `/notes/${noteId}/download`
      );

    return response.data;
  };