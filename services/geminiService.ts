
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateLogDescription = async (keywords: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key not configured. Please set the API_KEY environment variable.";
  }
  if (!keywords.trim()) {
    return "";
  }

  try {
    const prompt = `Based on the following keywords, write a professional, concise, and clear work log entry. The entry should be a single sentence or a short paragraph. Keywords: "${keywords}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "An error occurred while generating the description. Please try again.";
  }
};
