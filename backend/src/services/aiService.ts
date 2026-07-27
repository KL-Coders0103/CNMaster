import Groq from "groq-sdk";
import { AppError } from "../utils/AppError";

const groq = new Groq();

interface AiOptions {
  model?: string;
  expectJson?: boolean;
}

export const generateAiResponse = async (
  prompt: string,
  options: AiOptions = {}
): Promise<string> => {
  const model = options.model || "llama-3.1-8b-instant";
  const expectJson = options.expectJson ?? false;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      response_format: expectJson ? { type: "json_object" } : { type: "text" },
      temperature: 0.7, 
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";
    return responseText;
  } catch (error: any) {
    console.error("Groq AI Error:", error);
    
    if (error.status === 429) {
      throw new AppError("Rate limit exceeded on free tier. Please slow down.", 429);
    }
    
    throw new AppError("Failed to communicate with the Groq AI engine.", 500);
  }
};