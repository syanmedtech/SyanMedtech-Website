import React from 'react';
import { ICONS, SectionLabel } from '../constants';

const PublicServices: React.FC = () => {
  const modules = [
    {
      id: "01",
      title: "Academic Examination Architecture",
      icon: ICONS.Exam,
      problem: "Traditional online exams lack clinical rigor and integrity monitoring.",
      solution: "SYAN Exams provides a proctored environment with clinical image integration.",
      impact: "Used by 5,000+ candidates for licensing prep."
    },
    {
      id: "02",
      title: "Medical Learning Management (LMS)",
      icon: ICONS.Education,
      problem: "Generic platforms are not built for medical-specific content delivery.",
      solution: "Medical Globe offers modular video courses and patient case libraries.",
      impact: "Seamlessly integrates with national curriculum standards."
    },
    {
      id: "03",
      title: "Generative AI Diagnostics (DiagnoseRight)",
      icon: ICONS.AI,
      problem: "Clinical decision-making support is often static and hard to access.",
      solution: "A real-time simulator that generates patient cases for diagnostic reasoning.",
      impact: "Reduced documentation time by 40% in pilot programs."
    },
    {
      id: "04",
      title: "Clinical Workflow Dashboards",
      icon: ICONS.Clinic,
      problem: "Management tools are often non-intuitive for clinical staff.",
      solution: "Flat-design EMR interfaces focused on high-priority clinical actions.",
      impact: "Operational efficiency increased by 25% in multi-specialty clinics."
    }
  ];

  return (
    <div className="bg-syan-gray min-h-screen">
      <section className="bg-white py-14 px-6 lg:px-20 border-b border-syan-sky/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-2xl">
              <SectionLabel num="Services" text="Capability Portfolio" />
              <h1 className="serif text-4xl lg:text-5xl text-syan-dark mb-4">Clinical Grade Modules.</h1>
              <p className="text-gray-500 text-base font-medium leading-relaxed">
                We provide specialized medical-tech modules designed to be integrated into institutional frameworks.
              </p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {modules.map((module, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm grid lg:grid-cols-12 gap-10 items-start group">
              <div className="lg:col-span-1">
                <span className="serif text-5xl text-gray-100 group-hover:text-syan-teal transition-colors duration-500">{module.id}</span>
              </div>
              <div className="lg:col-span-4">
                <h2 className="text-xl font-bold text-syan-dark mb-4 tracking-tight">{module.title}</h2>
                <div className="w-10 h-10 bg-syan-sky/10 rounded-lg flex items-center justify-center text-syan-sky">
                  <module.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="lg:col-span-7 grid md:grid-cols-2 gap-8 border-l border-gray-50 pl-8">
                <div className="space-y-4">
                  <div>
                      <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">Clinical Problem</p>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{module.problem}</p>
                  </div>
                  <div>
                      <p className="text-[9px] uppercase font-black text-syan-teal tracking-widest mb-1">Module Solution</p>
                      <p className="text-xs text-syan-dark font-bold leading-relaxed">{module.solution}</p>
                  </div>
                </div>
                <div className="bg-syan-teal/[0.03] p-4 rounded-lg border border-syan-teal/5">
                    <p className="text-[9px] uppercase font-black text-syan-coral tracking-widest mb-2">Strategic Impact</p>
                    <p className="text-[11px] text-gray-500 italic font-medium">"{module.impact}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PublicServices;