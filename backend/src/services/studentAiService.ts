import prisma from "../config/prisma";
import { generateAiResponse } from "./aiService";
import { AppError } from "../utils/AppError";


export const askContextualTutor = async (userId: string, noteId: string, userMessage: string) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { chapter: true }
  });

  if (!note) throw new AppError("Associated study note not found", 404);

  const prompt = `
    You are a supportive, brilliant Computer Networking tutor inside the "CN Master" app.
    The student is currently studying the note titled "${note.title}" inside the chapter "${note.chapter.title}".
    
    Context about this topic:
    "${note.description || 'Core concepts of ' + note.title}"

    Student's Question:
    "${userMessage}"

    Provide a clear, accurate, and concise educational answer. Guide them to think critically if appropriate.
  `;

  const aiResponse = await generateAiResponse(prompt, false);
  return { success: true, reply: aiResponse };
};


export const explainConceptEli5 = async (textToExplain: string) => {
  const prompt = `
    Explain the following computer networking concept using the "Explain Like I'm 5" (ELI5) methodology.
    Use a simple, highly intuitive real-world analogy (like postal mail, highway traffic, or restaurant ordering). Keep it engaging and short.

    Concept text:
    "${textToExplain}"
  `;

  const aiResponse = await generateAiResponse(prompt, false);
  return { success: true, explanation: aiResponse };
};