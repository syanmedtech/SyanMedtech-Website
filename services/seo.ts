
import { GoogleGenAI, Type } from "@google/genai";

export interface SEOCheck {
  title: string;
  description: string;
  status: 'success' | 'error';
  category: 'basic' | 'title' | 'readability';
}

export interface SEOAnalysisResult {
  score: number;
  errors: {
    basic: number;
    title: number;
    readability: number;
  };
  checks: SEOCheck[];
}

export interface DetailedAISuggestions {
  optimizedTitle: string;
  metaDescription: string;
  suggestedHeadings: {
    h1: string;
    h2: string[];
    h3: string[];
  };
  keywordDensityFeedback: string;
  readabilitySuggestions: string[];
}

export const seoService = {
  calculateScore: (content: string, title: string, keyword: string): SEOAnalysisResult => {
    const checks: SEOCheck[] = [];
    const safeContent = content || '';
    const safeTitle = title || '';
    const safeKeyword = keyword || '';
    const plainText = safeContent.replace(/<[^>]*>/g, '').trim();
    const words = plainText.split(/\s+/).filter(w => w.length > 0).length;

    // --- BASIC SEO ---
    const keywordInContent = safeKeyword && plainText.toLowerCase().includes(safeKeyword.toLowerCase());
    checks.push({
      title: "Focus Keyword in content",
      description: keywordInContent ? "Focus Keyword found in content." : "Focus Keyword not found in content. Ensure your keyword is present naturally in the body text.",
      status: keywordInContent ? 'success' : 'error',
      category: 'basic'
    });

    const firstParagraph = plainText.split('\n')[0] || '';
    const keywordInIntro = safeKeyword && firstParagraph.toLowerCase().includes(safeKeyword.toLowerCase());
    checks.push({
      title: "Focus keyword in introduction",
      description: keywordInIntro ? "Focus keyword appears in the first paragraph." : "Your Focus keyword does not appear in the first paragraph. Make sure the topic is clear immediately.",
      status: keywordInIntro ? 'success' : 'error',
      category: 'basic'
    });

    const contentLenOk = words >= 600;
    checks.push({
      title: "Content length",
      description: contentLenOk ? `Good job! Content is ${words} words long.` : `Content is only ${words} words. Google prefers 600-1500 words for pillar medical content.`,
      status: contentLenOk ? 'success' : 'error',
      category: 'basic'
    });

    // --- TITLE SEO ---
    const keywordInTitle = safeKeyword && safeTitle.toLowerCase().includes(safeKeyword.toLowerCase());
    checks.push({
      title: "Focus keyword in Title",
      description: keywordInTitle ? "Focus keyword found in the title." : "The focus keyword was not found in the title.",
      status: keywordInTitle ? 'success' : 'error',
      category: 'title'
    });

    // --- READABILITY ---
    const hasHeadings = safeContent.includes('<h2') || safeContent.includes('<h3');
    checks.push({
      title: "Heading Hierarchy",
      description: hasHeadings ? "Structure is optimal." : "Missing H2/H3 subheadings. Medical texts require clear segmentation for SEO.",
      status: hasHeadings ? 'success' : 'error',
      category: 'readability'
    });

    const totalPossible = checks.length;
    const totalSuccessful = checks.filter(c => c.status === 'success').length;
    const score = Math.round((totalSuccessful / totalPossible) * 100);

    return {
      score,
      errors: {
        basic: checks.filter(c => c.category === 'basic' && c.status === 'error').length,
        title: checks.filter(c => c.category === 'title' && c.status === 'error').length,
        readability: checks.filter(c => c.category === 'readability' && c.status === 'error').length,
      },
      checks
    };
  },

  /**
   * AI-Powered Detailed SEO Assistant Analysis
   */
  analyzeContentDetailed: async (content: string, title: string, keyword: string): Promise<DetailedAISuggestions | null> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Perform a deep SEO and content analysis for this medical blog post.
      Title: ${title}
      Focus Keyword: ${keyword}
      Content Draft: ${content.replace(/<[^>]*>/g, '').substring(0, 3000)}
      
      Suggest an optimized Title (60 chars max), a meta description (160 chars max), a logical H1/H2/H3 structure, 
      feedback on keyword density (low, good, high) with explanation, and 3 readability improvement suggestions.
      
      Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimizedTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              suggestedHeadings: {
                type: Type.OBJECT,
                properties: {
                  h1: { type: Type.STRING },
                  h2: { type: Type.ARRAY, items: { type: Type.STRING } },
                  h3: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['h1', 'h2', 'h3']
              },
              keywordDensityFeedback: { type: Type.STRING },
              readabilitySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['optimizedTitle', 'metaDescription', 'suggestedHeadings', 'keywordDensityFeedback', 'readabilitySuggestions']
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Detailed SEO Analysis Error:", e);
      return null;
    }
  },

  generatePillarPost: async (title: string, keyword: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Act as a Senior Medical Content Strategist. Generate a comprehensive 1000-word Medical Pillar Blog Post following Google E-E-A-T guidelines.
      TOPIC: ${title}
      KEYWORD: ${keyword}
      
      STRICT RULES:
      1. HTML format only.
      2. Clear H1, H2, and H3 structure.
      3. Keyword in the first 100 words.
      4. Professional, authoritative medical tone.
      5. Include a bulleted "Clinical Summary" section.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { temperature: 0.7 }
      });
      return response.text;
    } catch (e) {
      console.error("Pillar Generation Error:", e);
      return null;
    }
  },

  suggestOptimizations: async (content: string, keyword: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Analyze this medical draft for SEO. Current keyword is "${keyword}". 
      Content: ${content.substring(0, 1500)}
      Provide 4 semantic keywords and 2 structural tips. Return JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['keywords', 'tips']
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("SEO Suggestion Error:", e);
      return null;
    }
  },

  predictAnalytics: async (content: string, title: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Score this clinical article (0-100) on Search Visibility, Clinical Authority, and Retention. 
      Title: ${title}
      Content: ${content.substring(0, 1000)}
      Return JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              seoScore: { type: Type.NUMBER },
              authorityScore: { type: Type.NUMBER },
              engagementScore: { type: Type.NUMBER },
              forecast: { type: Type.STRING }
            },
            required: ['seoScore', 'authorityScore', 'engagementScore', 'forecast']
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Analytics Forecast Error:", e);
      return null;
    }
  },

  generateRevisionSummary: async (oldContent: string, newContent: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Summarize the technical/clinical changes in 15 words or less.
      Old: ${oldContent.substring(0, 500)}
      New: ${newContent.substring(0, 500)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (e) {
      return "Article body updated.";
    }
  }
};
