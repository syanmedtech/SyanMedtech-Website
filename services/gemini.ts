
import { GoogleGenAI, Type } from "@google/genai";

// Note: process.env.API_KEY is pre-configured
export const geminiService = {
  initiateCase: async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate a complex medical case for a clinical simulation. The case should be realistic and require careful history taking. Return the data in JSON format.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              patientId: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.NUMBER },
              gender: { type: Type.STRING },
              presentingComplaint: { type: Type.STRING },
              vitals: {
                type: Type.OBJECT,
                properties: {
                  heartRate: { type: Type.NUMBER },
                  bloodPressure: { type: Type.STRING },
                  temp: { type: Type.NUMBER },
                  spo2: { type: Type.NUMBER }
                },
                required: ['heartRate', 'bloodPressure', 'temp', 'spo2']
              },
              hiddenDiagnosis: { type: Type.STRING },
              caseContext: { type: Type.STRING, description: "Detailed clinical background for the AI to maintain consistency" }
            },
            required: ['patientId', 'name', 'age', 'gender', 'presentingComplaint', 'vitals', 'hiddenDiagnosis', 'caseContext']
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Case Gen Error:", error);
      throw error;
    }
  },

  processClinicalQuery: async (history: { role: 'user' | 'model', text: string }[], caseContext: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const systemInstruction = `You are a patient in a medical simulation. 
      Case Context: ${caseContext}. 
      Respond naturally to the doctor's questions. Do not reveal the diagnosis directly. 
      If asked for physical exam findings or lab results, provide them only if they are relevant to the case and would be available at this stage. 
      Maintain a professional yet realistic patient persona.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history.map(h => ({ parts: [{ text: h.text }] })),
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Query Error:", error);
      return "The patient is unable to respond right now.";
    }
  },

  gradeDiagnosis: async (userDiagnosis: string, caseContext: string, hiddenDiagnosis: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Evaluate this medical student's diagnosis.
        Actual Diagnosis: ${hiddenDiagnosis}
        User's Diagnosis: ${userDiagnosis}
        Case Context: ${caseContext}
        Provide a concise evaluation including: Accuracy (0-100), Missed Critical Findings, and a brief Learning Point.`,
        config: {
          thinkingConfig: { thinkingBudget: 1000 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Grading Error:", error);
      return "Grading system unavailable. Consult your clinical supervisor.";
    }
  }
};
