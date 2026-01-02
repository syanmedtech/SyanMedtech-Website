
import { ICONS } from '../constants.tsx';

export interface ServiceItem {
  slug: string;
  id: string;
  title: string;
  subheading: string;
  icon: any;
  problem: string;
  solution: string;
  impact: string;
  dateTime: string;
  featureImage: string;
  descriptionPoints: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "academic-examination-architecture",
    id: "01",
    title: "Academic Examination Architecture",
    subheading: "Advanced proctoring systems engineered for medical certification integrity.",
    icon: ICONS.Exam,
    problem: "Traditional online exams lack clinical rigor and integrity monitoring.",
    solution: "SYAN Exams provides a proctored environment with clinical image integration.",
    impact: "Used by 5,000+ candidates for licensing prep.",
    dateTime: "2026-01-02 • 7:30 PM",
    featureImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200&h=600",
    descriptionPoints: [
      "Dynamic proctoring with AI-driven behavioral anomaly detection.",
      "High-fidelity clinical image rendering for diagnostic assessment.",
      "Encrypted results pipeline directly to institutional databases.",
      "Offline-first sync capabilities for high-latency environments.",
      "Standardized OSCE support for clinical skills evaluation."
    ]
  },
  {
    slug: "medical-learning-management",
    id: "02",
    title: "Medical Learning Management (LMS)",
    subheading: "A dedicated pedagogical framework for modern clinical instruction.",
    icon: ICONS.Education,
    problem: "Generic platforms are not built for medical-specific content delivery.",
    solution: "Medical Globe offers modular video courses and patient case libraries.",
    impact: "Seamlessly integrates with national curriculum standards.",
    dateTime: "2026-01-15 • 10:00 AM",
    featureImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200&h=600",
    descriptionPoints: [
      "Specialized clinical video streaming with zero-buffering technology.",
      "Interactive anatomy atlases and 3D modeling integrations.",
      "Tracked student progress aligned with specialty board requirements.",
      "Collaborative research modules for peer-to-peer faculty interaction.",
      "Automated CME credit generation and certification."
    ]
  },
  {
    slug: "generative-ai-diagnostics",
    id: "03",
    title: "Generative AI Diagnostics (DiagnoseRight)",
    subheading: "Leveraging Large Language Models for clinical decision support simulation.",
    icon: ICONS.AI,
    problem: "Clinical decision-making support is often static and hard to access.",
    solution: "A real-time simulator that generates patient cases for diagnostic reasoning.",
    impact: "Reduced documentation time by 40% in pilot programs.",
    dateTime: "2026-02-01 • 9:00 AM",
    featureImage: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=1200&h=600",
    descriptionPoints: [
      "Real-time patient avatar generation for diagnostic interviews.",
      "Probabilistic differential diagnosis scoring using Gemini 3 Pro.",
      "Feedback loops tailored to clinical accuracy and empathy levels.",
      "Extensive library of rare clinical presentations and comorbid states.",
      "API-first architecture for seamless EMR plugin deployment."
    ]
  },
  {
    slug: "clinical-workflow-dashboards",
    id: "04",
    title: "Clinical Workflow Dashboards",
    subheading: "Intuitive EMR visualization designed to minimize cognitive load.",
    icon: ICONS.Clinic,
    problem: "Management tools are often non-intuitive for clinical staff.",
    solution: "Flat-design EMR interfaces focused on high-priority clinical actions.",
    impact: "Operational efficiency increased by 25% in multi-specialty clinics.",
    dateTime: "2026-02-20 • 2:30 PM",
    featureImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200&h=600",
    descriptionPoints: [
      "Prioritized patient queue management based on acuity scores.",
      "Unified medical history view with intelligent trend highlighting.",
      "One-click prescription and referral generation workflows.",
      "Cross-departmental synchronization of laboratory and imaging results.",
      "Mobile-optimized views for rounds and bedside care."
    ]
  }
];
