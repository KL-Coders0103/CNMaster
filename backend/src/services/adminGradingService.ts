import prisma from "../config/prisma";
import { generateAiResponse } from "./aiService";
import { AppError } from "../utils/AppError";
const pdfParse = require("pdf-parse");

const downloadAndParsePdf = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from Cloudinary (Status: ${response.status})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  } catch (error) {
    console.error("PDF Download/Parse Error:", error);
    throw new AppError("Failed to extract text from the submission PDF. Ensure the file is not corrupted.", 500);
  }
};

export const autoGradeSubmission = async (submissionId: string) => {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: true }
  });

  if (!submission) throw new AppError("Submission record not found", 404);
  if (!submission.submissionUrl) throw new AppError("No file URL found for this submission", 400);

  if (!submission.submissionUrl.toLowerCase().endsWith(".pdf")) {
    throw new AppError("Smart Grading currently only supports PDF submissions.", 400);
  }

  const rawStudentContent = await downloadAndParsePdf(submission.submissionUrl);

  const safeStudentContent = rawStudentContent.length > 10000 
    ? rawStudentContent.substring(0, 10000) + "\n... [CONTENT TRUNCATED FOR GRADING]" 
    : rawStudentContent;

  const prompt = `
    You are an automated grading assistant for a Computer Networking course.
    Evaluate the student's submission text based on the core assignment criteria.

    Assignment Title: "${submission.assignment.title}"
    Max Marks: ${submission.assignment.totalMarks}
    
    Instructions/Rubric: 
    ---
    ${submission.assignment.instructions || "Assess structural accuracy."}
    ---
    
    Student Submission Content:
    ---
    ${safeStudentContent}
    ---

    Calculate a fair score and construct constructive, brief professional feedback.
    Return strictly a JSON object matching this structure with no markdown formatting:
    {
      "marksObtained": number,
      "feedback": "string evaluation details"
    }
  `;

  const aiResponse = await generateAiResponse(prompt, true);
  
  try {
    const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const evaluationDraft = JSON.parse(cleanJson);
    
    if (typeof evaluationDraft.marksObtained !== 'number') {
        evaluationDraft.marksObtained = 0;
    }
    
    evaluationDraft.marksObtained = Math.min(
        Math.max(0, evaluationDraft.marksObtained), 
        submission.assignment.totalMarks
    );

    return { success: true, evaluationDraft };
  } catch (error) {
    console.error("AI JSON Parse Error:", aiResponse);
    throw new AppError("AI generated an invalid grading format. Please try again.", 500);
  }
};