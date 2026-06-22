import { bookmarkQuestion, fetchBookmarks } from "../services/bookmarkService";
import { asyncHandler } from "../utils/asyncHandler";

export const toggleBookmarkController =
  asyncHandler(
    async (
      req,
      res
    ) => {

        const questionId =
  req.params.questionId as string;

      const result =
        await bookmarkQuestion(
          req.user!.userId,
          questionId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getBookmarksController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const result =
        await fetchBookmarks(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );