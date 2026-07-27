import prisma from "../config/prisma";
import { QuizDifficulty, Question } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { awardXp } from "./xpService"; 
import { XP_REWARDS } from "../constants/xpConstants";
import { evaluateQuizAchievements, evaluateTimeAndRecoveryAchievements } from "./achievementEvaluator";

interface AnswerPayload {
  questionId: string;
  selectedAnswer: string;
}

export const startQuiz = async (userId: string, chapterId: string, difficulty: QuizDifficulty) => {
  const questions = await prisma.question.findMany({
    where: { chapterId, difficulty },
    take: 10,
    select: { id: true, question: true, options: true, difficulty: true, marks: true },
  });

  if (questions.length === 0) {
    throw new AppError("No questions found for this chapter and difficulty.", 404);
  }

  const attempt = await prisma.quizAttempt.create({
    data: { userId, difficulty, totalQuestions: questions.length },
  });

  return { attemptId: attempt.id, questions };
};

export const submitQuiz = async (userId: string, attemptId: string, answers: AnswerPayload[]) => {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });

  if (!attempt || attempt.userId !== userId) {
    throw new AppError("Attempt not found or unauthorized", 403);
  }
  if (attempt.status !== "IN_PROGRESS") {
    throw new AppError("This quiz has already been submitted", 400);
  }

  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  });

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let score = 0;
  let trueTotalMarks = 0; 
  let correctAnswersCount = 0;
  const chapterMistakeCounts: Record<string, number> = {};

  const quizChapterId = questions.length > 0 ? questions[0].chapterId : "";

  const quizAnswersData = answers.map((answer) => {
    const question = questionMap.get(answer.questionId);
    if (!question) throw new AppError(`Invalid question ID: ${answer.questionId}`, 400);

    trueTotalMarks += question.marks; 

    const isCorrect = question.correctAnswer === answer.selectedAnswer;

    if (isCorrect) {
      score += question.marks;
      correctAnswersCount++;
    } else {
      chapterMistakeCounts[question.chapterId] = (chapterMistakeCounts[question.chapterId] || 0) + 1;
    }

    return {
      attemptId,
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
    };
  });

  const durationInSeconds = Math.floor((new Date().getTime() - attempt.startedAt.getTime()) / 1000);

  const previousCompletedAttempts = await prisma.quizAttempt.count({
    where: { userId, status: "COMPLETED" } 
  });
  const isFirstAttempt = previousCompletedAttempts === 0;

  const weakAreaUpserts = Object.entries(chapterMistakeCounts).map(([chapterId, count]) => {
    return prisma.weakArea.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: { mistakeCount: { increment: count } },
      create: { userId, chapterId, mistakeCount: count },
    });
  });

  try {
    const [updatedAttempt] = await prisma.$transaction([
      prisma.quizAttempt.update({
        where: { 
          id: attemptId,
          status: "IN_PROGRESS" 
        },
        data: {
          score,
          totalMarks: trueTotalMarks, 
          correctAnswers: correctAnswersCount,
          wrongAnswers: answers.length - correctAnswersCount,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      }),
      prisma.quizAnswer.createMany({ data: quizAnswersData }),
      ...weakAreaUpserts,
    ]);

    let totalXpEarned = XP_REWARDS.QUIZ_ATTEMPTED + (correctAnswersCount * XP_REWARDS.QUIZ_CORRECT_ANSWER);
    
    const isPerfectScore = correctAnswersCount === attempt.totalQuestions;
    if (isPerfectScore) {
      totalXpEarned += XP_REWARDS.QUIZ_PERFECT_SCORE;
    }

    const xpResult = await awardXp(userId, totalXpEarned, "QUIZ_COMPLETED", attemptId);

    evaluateQuizAchievements(userId, quizChapterId, score, trueTotalMarks, durationInSeconds, isFirstAttempt).catch(console.error);
    evaluateTimeAndRecoveryAchievements(userId).catch(console.error);

    return {
      ...updatedAttempt,
      gamification: {
        xpEarned: totalXpEarned,
        newLevel: xpResult?.level ?? 1,
        isPerfectScore
      }
    };
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new AppError("Quiz was already submitted. (Double-tap prevented).", 409);
    }
    throw error;
  }
};

export const fetchQuizResult = async (attemptId: string) => {
  return prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quizAnswers: { include: { question: { select: { question: true, options: true, correctAnswer: true, explanation: true } } } },
    },
  });
};

export const fetchQuizHistory = async (userId: string) => {
  return prisma.quizAttempt.findMany({
    where: { userId, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};

export const fetchTodayChallenge = async () => {
  return prisma.dailyChallenge.findFirst({
    orderBy: { date: "desc" },
  });
};

export const fetchAdaptiveQuiz = async (userId: string) => {
  const weakAreas = await prisma.weakArea.findMany({
    where: { userId },
    orderBy: { mistakeCount: "desc" },
    take: 3,
  });

  const weakChapterIds = weakAreas.map((area) => area.chapterId);
  let questions: Question[] = [];

  if (weakChapterIds.length > 0) {
    questions = await prisma.question.findMany({
      where: { chapterId: { in: weakChapterIds } },
      take: 10,
    });
  }

  if (questions.length < 10) {
    const existingQuestionIds = questions.map((q) => q.id);
    const extraQuestions = await prisma.question.findMany({
      where: { id: { notIn: existingQuestionIds } },
      take: 10 - questions.length,
    });
    questions = [...questions, ...extraQuestions];
  }

  return questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
    marks: q.marks
  }));
};