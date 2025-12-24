
import { GoogleGenAI } from "@google/genai";

// Note: process.env.API_KEY is pre-configured
export const geminiService = {
  generateDiagnosis: async (caseDescription: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior medical consultant. Based on this clinical presentation, provide a structured admission case including: Differential Diagnosis, Recommended Investigations, and a preliminary Treatment Plan. Clinical Presentation: ${caseDescription}`,
        config: {
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate diagnosis at this time. Please consult clinical guidelines.";
    }
  }
};
