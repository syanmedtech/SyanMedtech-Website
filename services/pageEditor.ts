
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./firestore.ts";

export type BlockType = 
  | 'hero' | 'text' | 'image' | 'cta' | 'service-grid' 
  | 'impact-stat' | 'divider' | 'blog-teaser'
  | 'cta-banner' | 'heading' | 'video' | 'pricing' | 'accordion' | 'maps' | 'spacer'
  | 'clinical-vitals';

export interface PageBlock {
  id: string;
  type: BlockType;
  content: any;
  order: number;
  isLocked?: boolean;
}

export const DEFAULT_STRUCTURE: PageBlock[] = [
  { 
    id: 'hero-1', 
    type: 'hero', 
    order: 1, 
    content: {
      label: "01 // SYSTEM ENTRY",
      headline: "Synergizing Medical Innovation and Education.",
      subheadline: "Combining AI diagnostics with advanced learning platforms to empower the next generation of clinical excellence and institutional precision.",
      buttonText: "Request Platform Access",
      pills: ['Innovation', 'Education', 'Clinical AI', 'Scalable'],
      bgImages: [
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=2000", // Medical Innovation Lead
        "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1557946632-4d2b6180c4c4?auto=format&fit=crop&q=80&w=2000"
      ],
      vitals: [
        { label: "Global Reach", value: "15k+ Clinicians", sub: "Active Ecosystem Users" },
        { label: "Intelligence", value: "DiagnoseRight™ Core", sub: "AI Diagnostic Engine" },
        { label: "Compliance", value: "Clinical-Grade", sub: "HIPAA / GDPR Compliant" }
      ]
    }
  },
  {
    id: 'blogs-teaser-1',
    type: 'blog-teaser',
    order: 2,
    content: {
      label: "02 // Medical Insights",
      headline: "Latest from the Research Registry.",
      linkText: "View All Papers →",
      items: [
        { 
          category: "AI TECHNOLOGY", 
          title: "The Future of AI in Clinical Diagnosis", 
          detail: "Technical overview of generative clinical reasoning models in post-graduate education.",
          icon: "AI"
        },
        { 
          category: "ACADEMIC INTEGRITY", 
          title: "Digital Integrity in High-Stakes Exams", 
          detail: "How blockchain-linked proctoring is setting new standards for medical certification.",
          icon: "Exam"
        }
      ]
    }
  },
  {
    id: 'ecosystem-hub',
    type: 'service-grid',
    order: 3,
    content: {
      orbitHeadline: "Interconnected Knowledge Mesh",
      orbitSub: "REAL-TIME CLINICAL SYNCHRONIZATION",
      gridLabel: "2.1 // MODULE SPECIFICATIONS",
      items: [
        { id: "dashboards", title: "DASHBOARDS", detail: "High-performance institutional clinic management and reporting.", icon: "Clinic" },
        { id: "exams", title: "EXAMS", detail: "Secure, proctored high-stakes examination environment.", icon: "Exam" },
        { id: "lms", title: "LMS", detail: "Modular medical learning management system.", icon: "Education" },
        { id: "ai-clinical", title: "AI CLINICAL", detail: "Gemini-powered diagnostic reasoning simulators.", icon: "AI" },
        { id: "publications", title: "PUBLICATIONS", detail: "Digital medical research and publication repository.", icon: "Publication" },
        { id: "volunteer", title: "VOLUNTEER", detail: "Community-driven healthcare volunteer programs.", icon: "Clinic" },
        { id: "scholarships", title: "SCHOLARSHIPS", detail: "Medical excellence funding and scholarship portal.", icon: "Scholarship" },
        { id: "resources", title: "RESOURCES", detail: "Structured clinical revision notes and resources.", icon: "Notes" }
      ]
    }
  },
  {
    id: 'impact-stats-1',
    type: 'impact-stat',
    order: 4,
    content: {
      label: "04 //",
      headline: "Empowering the Future of Health.",
      subheadline: "SYAN MED Tech annually supports dozens of students through our internal scholarship fund and research index, ensuring innovation is accessible to all.",
      buttonText: "View Our Mission Report",
      stats: [
        { label: "SCHOLARSHIPS", value: "PKR 2.5M+", color: "text-syan-sky" },
        { label: "RESEARCH PAPERS", value: "15+ Indexed", color: "text-syan-coral" },
        { label: "DATA POINTS", value: "1.2M daily", color: "text-syan-yellow" },
        { label: "INSTITUTIONS", value: "12 National", color: "text-white" }
      ]
    }
  },
  {
    id: 'cta-banner-1',
    type: 'cta-banner',
    order: 5,
    content: {
      label: "GLOBAL COLLABORATION PORTFOLIO",
      headline: "Advancing Medical Standards Through Digital Excellence.",
      buttonText: "Partner With Our Ecosystem"
    }
  }
];

export const pageEditorService = {
  getDraft: async () => {
    const draft = await db.get('pages', 'landing_draft');
    return (draft?.blocks || DEFAULT_STRUCTURE).sort((a: any, b: any) => a.order - b.order);
  },

  getLive: async () => {
    const live = await db.get('pages', 'landing_live');
    return (live?.blocks || DEFAULT_STRUCTURE).sort((a: any, b: any) => a.order - b.order);
  },

  resetToDefault: async () => {
    await db.save('pages', 'landing_draft', { blocks: DEFAULT_STRUCTURE });
    return DEFAULT_STRUCTURE;
  },

  saveDraft: async (blocks: PageBlock[]) => {
    return await db.save('pages', 'landing_draft', { blocks });
  },

  publish: async (blocks: PageBlock[]) => {
    await db.save('pages', 'landing_draft', { blocks });
    return await db.save('pages', 'landing_live', { blocks });
  },

  aiGenerateContent: async (blockType: BlockType, context: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const prompt = `Act as a Senior Medical Content Strategist. Generate high-converting clinical copy for a ${blockType} block. 
    Context: ${context}
    Tone: Professional, Authoritative, Medical-Grade.
    Return JSON with fields appropriate for this block.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  }
};
