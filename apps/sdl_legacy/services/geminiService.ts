import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCourseContent = async (topic: string, level: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a structured learning module for the topic: "${topic}" at a "${level}" level. 
      The output should be suitable for an e-learning platform.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedDuration: { type: Type.STRING }
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No text returned");
  } catch (error) {
    console.error("Content generation failed", error);
    throw error;
  }
};

export const getGeminiClient = () => ai;
