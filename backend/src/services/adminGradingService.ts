import prisma from "../config/prisma";
import { generateAiResponse } from "./aiService";
import { AppError } from "../utils/AppError";

export const autoGradeSubmission = async (submissionId: string) => {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: true }
  });

  if (!submission) throw new AppError("Submission record not found", 404);

  const prompt = `
    You are an automated grading assistant for a Computer Networking course.
    Evaluate the student's submission text based on the core assignment criteria.

    Assignment Title: "${submission.assignment.title}"
    Max Marks: ${submission.assignment.totalMarks}
    Instructions/Rubric: "${submission.assignment.instructions || "Assess structural accuracy."}"
    
    Student Submission URL/Text Reference:
    "${submission.submissionUrl}"

    Calculate a fair score and construct constructive, brief professional feedback.
    Return strictly a JSON object:
    {
      "marksObtained": number (cannot exceed ${submission.assignment.totalMarks}),
      "feedback": "string evaluation details"
    }
  `;

  const aiResponse = await generateAiResponse(prompt, true);
  return { success: true, evaluationDraft: JSON.parse(aiResponse) };
};