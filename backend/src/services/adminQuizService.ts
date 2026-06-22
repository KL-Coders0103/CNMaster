import prisma from "../config/prisma";
import { QuizDifficulty, AssessmentType } from "@prisma/client";
import { generateAiResponse } from "./aiService";
import { AppError } from "../utils/AppError";

export const addQuestion = async (data: {
  chapterId: string;
  question: string;
  options: any;
  correctAnswer: string;
  explanation?: string;
  difficulty: QuizDifficulty;
  marks: number;
}) => {
  const newQuestion = await prisma.question.create({
    data: {
      chapterId: data.chapterId,
      question: data.question,
      options: data.options,
      correctAnswer: data.correctAnswer,
      explanation: data.explanation || "",
      difficulty: data.difficulty,
      marks: data.marks,
    },
  });

  return { success: true, message: "Question added to bank", data: newQuestion };
};

export const getQuestionsByChapter = async (chapterId: string) => {
  const questions = await prisma.question.findMany({
    where: { chapterId },
    orderBy: { createdAt: "desc" }
  });
  return { success: true, data: questions };
};

export const createQuizAssessment = async (data: {
  title: string;
  dueDate: Date;
  timeLimit: number;
  questionLimit: number;
  xpReward: number;
  targetYear?: string;
  targetBranch?: string;
}) => {
  const assessment = await prisma.assessment.create({
    data: {
      title: data.title,
      type: AssessmentType.Quiz,
      dueDate: data.dueDate,
      timeLimit: data.timeLimit,
      questionLimit: data.questionLimit,
      xpReward: data.xpReward,
      targetYear: data.targetYear || null,
      targetBranch: data.targetBranch || null,
    },
  });

  return { success: true, message: "Quiz Assessment configured successfully", data: assessment };
};

export const generateQuizWithAi = async (chapterId: string, sourceText: string, questionCount: number = 5) => {
  const prompt = `
    You are an expert Computer Science professor. 
    Based ONLY on the following text, generate ${questionCount} multiple-choice questions.
    
    Source Text:
    "${sourceText}"

    You MUST return the output strictly as a JSON array of objects matching this exact structure, with no markdown formatting or extra text:
    [
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The exact string of the correct option",
        "explanation": "A brief explanation of why this is correct",
        "difficulty": "EASY" // Must be exactly "EASY", "MEDIUM", or "HARD"
      }
    ]
  `;

  const aiResponse = await generateAiResponse(prompt, true);

  try {
    const generatedQuestions = JSON.parse(aiResponse);

    const prismaData = generatedQuestions.map((q: any) => ({
      chapterId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
      difficulty: q.difficulty,
      marks: q.difficulty === "HARD" ? 3 : q.difficulty === "MEDIUM" ? 2 : 1,
    }));

    const savedQuestions = await prisma.question.createMany({
      data: prismaData,
    });

    return { 
      success: true, 
      message: `Successfully generated and saved ${savedQuestions.count} questions.`,
      data: generatedQuestions 
    };
  } catch (error) {
    console.error("Failed to parse AI response:", aiResponse);
    throw new AppError("AI generated an invalid format. Please try again.", 500);
  }
};