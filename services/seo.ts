
import { GoogleGenAI, Type } from "@google/genai";

export const seoService = {
  calculateScore: (content: string, title: string, keyword: string) => {
    let score = 0;
    const checks = [];
    const safeContent = content || '';
    const safeTitle = title || '';
    const safeKeyword = keyword || '';
    
    const plainText = safeContent.replace(/<[^>]*>/g, '');

    // Title Length
    if (safeTitle.length > 30 && safeTitle.length < 60) { score += 20; checks.push("Title length optimal"); }
    else { checks.push("Title length sub-optimal (Aim for 30-60 chars)"); }

    // Keyword in Title
    if (safeTitle.toLowerCase().includes(safeKeyword.toLowerCase()) && safeKeyword.length > 0) { score += 20; checks.push("Focus keyword in title"); }
    else { checks.push("Missing focus keyword in title"); }

    // Content Length
    const words = plainText.split(/\s+/).filter(w => w.length > 0).length;
    if (words > 600) { score += 20; checks.push("Excellent content depth (600+ words)"); }
    else if (words > 300) { score += 10; checks.push("Good content length"); }
    else { checks.push("Content too short for SEO"); }

    // Keyword in Content
    if (safeKeyword.length > 0) {
      const occurrences = (plainText.toLowerCase().split(safeKeyword.toLowerCase()).length - 1);
      const density = words > 0 ? occurrences / words : 0;
      if (density > 0.005 && density < 0.025) { score += 20; checks.push(`Ideal density (${(density * 100).toFixed(1)}%)`); }
      else if (density > 0) { checks.push("Keyword density too low (<0.5%)"); }
      else { checks.push("Keyword not found in content"); }
    }

    // Headings
    if (safeContent.includes("<h2") || safeContent.includes("<h3")) { score += 20; checks.push("Hierarchical headings detected"); }
    else { checks.push("Missing H2 or H3 tags"); }

    return { score, checks };
  },

  generateSEOContent: async (title: string, keyword: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Write a professional medical blog post following strict Google SEO and E-E-A-T guidelines.
      Title: ${title}
      Focus Keyword: ${keyword}
      
      Requirements:
      1. Use clear H2 and H3 headings.
      2. Include the focus keyword in the first paragraph.
      3. Maintain a keyword density of 1-2%.
      4. Write in a professional, authoritative medical tone.
      5. Include a summary and a conclusion.
      6. Use HTML tags (<h2>, <h3>, <p>, <ul>, <li>).
      7. Word count should be approximately 600-800 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (e) {
      console.error("AI Generation Error:", e);
      return null;
    }
  },

  getAIAssistantAdvice: async (title: string, content: string, keyword: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this medical blog for SEO. 
        Title: ${title}
        Keyword: ${keyword}
        Content: ${content.substring(0, 1000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              headingSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              medicalAuthorityTips: { type: Type.STRING }
            },
            required: ["suggestedTitle", "metaDescription", "headingSuggestions"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return null;
    }
  }
};
