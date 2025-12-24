
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./firestore.ts";

export type BlockType = 
  | 'hero' | 'text' | 'image' | 'cta' | 'service-grid' 
  | 'impact-stat' | 'divider' | 'footer' | 'blog-teaser'
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
      label: "01 // Introduction",
      headline: "Medical Education, & Clinical Technology.",
      subheadline: "SYAN MED Tech provides a cohesive ecosystem bridging the gap between clinical reality and academic excellence through secure, intelligent software.",
      buttonText: "Request Demo",
      pills: ['Secure', 'HIPAA Ready', 'Scalable', 'AI-Driven'],
      vitals: [
        { label: "Global Reach", value: "10k+ Students", sub: "Active Academic Users" },
        { label: "Infrastructure", value: "Secure Micro-services", sub: "Production-Ready Scale" },
        { label: "Intelligence", value: "Gemini 3 Pro", sub: "Clinical Fine-Tuning" }
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
  },
  { 
    id: 'footer-1', 
    type: 'footer', 
    order: 6, 
    content: { 
      description: "Pioneering medical technology solutions for the modern healthcare era. Empowering educators and professionals with secure, scalable platforms.",
      copyright: "© 2025 SYAN MED Tech. All rights reserved.",
      email: "info@syanmed.tech",
      phone: "+1 (555) 123-4567",
      address: "Medical City, Tech District"
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
