import { AppError } from "../utils/AppError";

const AI_BASE_URL = process.env.OLLAMA_URL;
const AI_MODEL = process.env.AI_MODEL; 

export const generateAiResponse = async (prompt: string, expectJson: boolean = false): Promise<string> => {
  try {
    const response = await fetch(`${AI_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: AI_MODEL,
        prompt: prompt,
        stream: false,
        format: expectJson ? "json" : undefined, 
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new AppError("Failed to communicate with the AI engine. Ensure Ollama is running.", 500);
  }
};