
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSummary = async (text: string, language: 'en' | 'si' = 'en'): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");
  
  const model = "gemini-3-flash-preview";
  const langInstruction = language === 'si' 
    ? "IMPORTANT: You MUST write the entire summary in Sinhala (සිංහල) script only. Do not use English words unless they are technical terms." 
    : "Write the summary in clear, professional English.";
  
  const prompt = `Provide a concise, high-quality summary (5-7 sentences) of the following text. 
  Capture the main ideas, key arguments, and conclusions. 
  ${langInstruction} 
  
  Text to summarize: ${text.substring(0, 30000)}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.3,
    }
  });

  return response.text || "Could not generate summary.";
};

export const generateQuiz = async (text: string, language: 'en' | 'si' = 'en'): Promise<QuizQuestion[]> => {
  if (!apiKey) throw new Error("API Key missing");

  const model = "gemini-3-flash-preview";
  const langInstruction = language === 'si' 
    ? "IMPORTANT: The 'question', 'options', and 'correctAnswer' values MUST be written in Sinhala (සිංහල) script. Ensure the JSON structure is preserved exactly." 
    : "The quiz content must be in English.";
  
  const prompt = `Generate a quiz based on the text provided. 
  Create 5 multiple-choice questions. 
  ${langInstruction}
  Return the response in JSON format.
  
  Text context: ${text.substring(0, 25000)}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['multiple-choice'] }
          },
          required: ['id', 'question', 'options', 'correctAnswer', 'type']
        }
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as QuizQuestion[];
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      return [];
    }
  }
  return [];
};
