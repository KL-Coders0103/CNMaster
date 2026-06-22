import {
  generateAdaptiveQuiz,
} from "../repositories/adaptiveQuizRepository";

export const fetchAdaptiveQuiz =
  async (
    userId: string
  ) => {

    const questions =
      await generateAdaptiveQuiz(
        userId
      );

    return {
      success: true,

      message:
        "Adaptive quiz generated successfully",

      data: questions,
    };
  };