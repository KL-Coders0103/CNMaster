import {
  Request,
  Response,
} from "express";

import { asyncHandler }
from "../utils/asyncHandler";

import {
  fetchAssignmentAnalytics,
  fetchAssignmentDetails,
  fetchAssignments,
  fetchSubmissionHistory,
  fetchUpcomingAssignment,
  submitAssignment,
} from "../services/assignmentService";
import { AppError } from "../utils/AppError";
import { uploadAssignmentFile } from "../services/uploadAssignmentFile";

export const getAssignmentsController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const chapterId =
        req.query.chapterId as string;

      const search =
        req.query.search as string;

      const result =
        await fetchAssignments(
          req.user!.userId,
          chapterId,
          search
        );

      res.status(200).json(
        result
      );
    }
  );

export const getAssignmentDetailsController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const assignmentId = Array.isArray(req.params.assignmentId) ? req.params.assignmentId[0] : req.params.assignmentId ;

      const result =
        await fetchAssignmentDetails(
          assignmentId,
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const submitAssignmentController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const assignmentId = Array.isArray(req.params.assignmentId) ? req.params.assignmentId[0] : req.params.assignmentId ;

      if (!req.file) {

        throw new AppError(
          "Submission file required",
          400
        );
      }

      const uploadResult =
        await uploadAssignmentFile(
          req.file
        );

      const result =
        await submitAssignment(
          assignmentId,
          req.user!.userId,
          uploadResult.secure_url
        );

      res.status(200).json(
        result
      );
    }
  );

  export const getSubmissionHistoryController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await fetchSubmissionHistory(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );

  export const getUpcomingAssignmentController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await fetchUpcomingAssignment(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );

  export const getAssignmentAnalyticsController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const result =
        await fetchAssignmentAnalytics(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );