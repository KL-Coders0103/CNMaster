import {
  toggleBookmark,
  getBookmarkedQuestions,
} from "../repositories/bookmarkRepository";

export const bookmarkQuestion =
  async (
    userId: string,
    questionId: string
  ) => {

    return toggleBookmark(
      userId,
      questionId
    );
  };

export const fetchBookmarks =
  async (
    userId: string
  ) => {

    const bookmarks =
      await getBookmarkedQuestions(
        userId
      );

    return {
      success: true,
      data: bookmarks,
    };
  };