import prisma from "../config/prisma";
import { generateAiResponse } from "./aiService";

export const generateSmartStudyPlan = async (userId: string) => {
  const weakAreas = await prisma.weakArea.findMany({
    where: { userId },
    include: { chapter: true },
    orderBy: { mistakeCount: "desc" },
    take: 3
  });

  if (weakAreas.length === 0) {
    return { success: true, message: "No weak areas tracked yet! Keep taking quizzes to populate your plan." };
  }

  const topicsList = weakAreas.map(wa => `- ${wa.chapter.title} (Mistakes tracked: ${wa.mistakeCount})`).join("\n");

  const prompt = `
    You are an automated academic scheduler. Review this student's weakest networking topics:
    ${topicsList}

    Generate exactly 3 actionable, highly specific study tasks to help them improve this week.
    Return strictly a JSON array matching this schema:
    [
      {
        "title": "Short title of task",
        "description": "Clear step-by-step study objective"
      }
    ]
  `;

  const aiResponse = await generateAiResponse(prompt, true);
  const tasks = JSON.parse(aiResponse);

  const lookaheadDate = new Date();
  const createdTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    lookaheadDate.setDate(lookaheadDate.getDate() + 1); // Space tasks out across consecutive days
    const newTask = await prisma.plannerTask.create({
      data: {
        userId,
        title: tasks[i].title,
        description: tasks[i].description,
        dueDate: new Date(lookaheadDate),
      }
    });
    createdTasks.push(newTask);
  }

  return { success: true, message: "Smart study schedule synchronized with your planner", data: createdTasks };
};

export const generateNoteFlashcards = async (noteId: string) => {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) throw new Error("Note item not found");

  const prompt = `
    Extract 5 critical terminal terms or operational definitions from this study document text.
    
    Document:
    "${note.description || note.title}"

    Return strictly a JSON array matching this format:
    [
      { "front": "The technical term or question", "back": "The concise definition or layout answer" }
    ]
  `;

  const aiResponse = await generateAiResponse(prompt, true);
  return { success: true, flashcards: JSON.parse(aiResponse) };
};