
import { GoogleGenAI, Type } from "@google/genai";

// Note: process.env.API_KEY is pre-configured
export const geminiService = {
  initiateCase: async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate a high-fidelity medical case for a clinical simulation. The case should be complex and require differential diagnosis. Return data in JSON format.",
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
              caseContext: { type: Type.STRING, description: "Detailed clinical history for AI persona consistency" }
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
      Respond naturally. Do not mention your diagnosis directly. 
      If asked about symptoms, describe them as a patient would. 
      If asked for vitals, you can describe how you feel (e.g., "My heart feels like it's racing").`;

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
      return "The patient is too distressed to speak clearly.";
    }
  },

  gradeDiagnosis: async (userDiagnosis: string, caseContext: string, hiddenDiagnosis: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Evaluate this medical diagnosis.
        Actual Diagnosis: ${hiddenDiagnosis}
        User's Diagnosis: ${userDiagnosis}
        Case Context: ${caseContext}
        Provide a structured evaluation including: Accuracy Score (0-100), Missed Findings, and Learning Point.`,
        config: {
          thinkingConfig: { thinkingBudget: 2000 }
        }
      });
      return response.text;
    } catch (error) {
      return "Grading engine offline.";
    }
  },

  audio: {
    encode: (bytes: Uint8Array) => {
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    },
    decode: (base64: string) => {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    },
    async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
      for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
      }
      return buffer;
    }
  }
};
