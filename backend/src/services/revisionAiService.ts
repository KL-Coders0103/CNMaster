import prisma from "../config/prisma";
import { generateAiResponse } from "./aiService";
import { AppError } from "../utils/AppError";

const safeJsonParse = (rawText: string) => {
  try {
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Failed to parse AI output as JSON:", rawText);
    throw new AppError("The AI generated an invalid format. Please try again.", 500);
  }
};

export const generateSmartStudyPlan = async (userId: string) => {
  const weakAreas = await prisma.weakArea.findMany({
    where: { userId },
    include: { chapter: true },
    orderBy: { mistakeCount: "desc" },
    take: 3
  });

  if (weakAreas.length === 0) {
    return { success: true, message: "No weak areas tracked yet! Keep taking quizzes." };
  }

  const topicsList = weakAreas.map(wa => `- ${wa.chapter.title} (Mistakes tracked: ${wa.mistakeCount})`).join("\n");

  const prompt = `
    You are an automated academic scheduler. Review this student's weakest networking topics:
    ${topicsList}

    Generate exactly 3 actionable, highly specific study tasks to help them improve this week.
    Return strictly JSON matching this schema:
    {
      "tasks": [
        {
          "title": "Short title of task",
          "description": "Clear step-by-step study objective"
        }
      ]
    }
  `;

  const aiResponse = await generateAiResponse(prompt, { expectJson: true});
  const parsedData = safeJsonParse(aiResponse); 

  const tasks = Array.isArray(parsedData) ? parsedData : parsedData.tasks;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    console.error("AI output did not contain a valid array:", parsedData);
    throw new AppError("AI failed to generate a valid task list.", 500);
  }

  const lookaheadDate = new Date();
  const tasksToCreate = tasks.map((task: any) => {
    lookaheadDate.setDate(lookaheadDate.getDate() + 1);
    return {
      userId,
      title: String(task.title), 
      description: String(task.description), 
      dueDate: new Date(lookaheadDate),
    };
  });

  await prisma.plannerTask.createMany({ data: tasksToCreate });

  return { 
    success: true, 
    message: "Smart study schedule synchronized with your planner", 
    data: tasksToCreate 
  };
};

export const generateNoteFlashcards = async (noteId: string) => {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) throw new AppError("Note item not found", 404);

  const prompt = `
    Extract 5 critical terminal terms or operational definitions from this study document text.
    
    Document:
    "${note.description || note.title}"

    Return strictly a JSON array matching this format without markdown wrappers:
    [
      { "front": "The technical term", "back": "The concise definition" }
    ]
  `;

  const aiResponse = await generateAiResponse(prompt, { expectJson: true });
  const flashcards = safeJsonParse(aiResponse);

  return { success: true, flashcards };
};