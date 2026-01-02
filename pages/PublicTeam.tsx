
import React, { useState, useEffect } from 'react';
import { SectionLabel } from '../constants.tsx';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  category: 'Leadership' | 'Technology' | 'Medical';
  shortBio: string;
  fullBio: string;
  image: string;
  accent: string;
  bgAccent: string;
  social: {
    linkedin?: string;
    email?: string;
    twitter?: string;
    website?: string;
  };
  highlights?: string[];
  expertise?: string[];
}

const PublicTeam: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedMember]);

  const faculty: TeamMember[] = [
    {
      id: "f1",
      name: "Dr. Salman Yan",
      role: "Principal Architect",
      dept: "Clinical Strategy",
      category: 'Leadership',
      accent: 'text-syan-teal',
      bgAccent: 'bg-syan-teal/10',
      shortBio: "Former consultant physician specializing in health informatics and digital strategy.",
      fullBio: "Dr. Salman Yan is a visionary at the intersection of clinical practice and digital architecture. With over 15 years in consultant medicine, he transitioned into tech to solve the systemic inefficiencies he witnessed first-hand. He leads our strategic vision, ensuring every module we build serves a genuine clinical purpose while maintaining the highest academic standards.",
      image: "https://i.pravatar.cc/150?u=Dr.SalmanYan",
      social: {
        linkedin: "https://linkedin.com",
        email: "salman@syanmed.tech",
        twitter: "https://twitter.com"
      },
      highlights: [
        "Led national digital health transformation initiatives",
        "Author of 'The Algorithmic Clinician'",
        "Board certified in Internal Medicine & Medical Informatics"
      ],
      expertise: ["Clinical Strategy", "Health Informatics", "Systems Architecture"]
    },
    {
      id: "f2",
      name: "Ahmed Khan",
      role: "Chief Systems Engineer",
      dept: "Infrastructure",
      category: 'Technology',
      accent: 'text-syan-yellow',
      bgAccent: 'bg-syan-yellow/10',
      shortBio: "Architect of our secure exam engine and data integrity protocols.",
      fullBio: "Ahmed Khan brings deep expertise in high-concurrency systems and cybersecurity. He designed the backbone of the SYAN proctoring engine, ensuring it can handle thousands of simultaneous medical exam candidates with zero downtime and perfect integrity. His focus is on making complex technology invisible and frictionless for the end user.",
      image: "https://i.pravatar.cc/150?u=AhmedKhan",
      social: {
        linkedin: "https://linkedin.com",
        email: "ahmed@syanmed.tech",
        website: "https://ahmed.tech"
      },
      highlights: [
        "Architected one of the world's most secure proctoring engines",
        "Expert in distributed ledger technology for academic credentials",
        "Former infrastructure lead at several scale-ups"
      ],
      expertise: ["Cybersecurity", "Distributed Systems", "Integrity Protocols"]
    },
    {
      id: "f3",
      name: "Prof. Sarah Malik",
      role: "Medical Advisor",
      dept: "Academic Research",
      category: 'Medical',
      accent: 'text-syan-coral',
      bgAccent: 'bg-syan-coral/10',
      shortBio: "Leading researcher in medical education pedagogy and student evaluation.",
      fullBio: "Professor Sarah Malik ensures that our technology remains pedagogically sound. Her research in medical student evaluation informs the grading algorithms and learning pathways within our LMS. She bridges the gap between academic theory and the practical requirements of modern medical licensing boards.",
      image: "https://i.pravatar.cc/150?u=SarahMalik",
      social: {
        linkedin: "https://linkedin.com",
        email: "sarah@syanmed.tech"
      },
      highlights: [
        "Chair of the National Medical Pedagogy Board",
        "Published 50+ papers on clinical evaluation methods",
        "Recipient of the Medical Educator Excellence Award"
      ],
      expertise: ["Pedagogy", "Clinical Assessment", "Medical Research"]
    },
    {
      id: "f4",
      name: "Bilal Raza",
      role: "Lead Developer",
      dept: "AI & ML",
      category: 'Technology',
      accent: 'text-syan-yellow',
      bgAccent: 'bg-syan-yellow/10',
      shortBio: "Expert in LLM fine-tuning for specialized medical diagnostic datasets.",
      fullBio: "Bilal is the brain behind DiagnoseRight 3.0. He specializes in the fine-tuning of large language models on proprietary clinical datasets, ensuring our AI responses are accurate, empathetic, and clinically safe. He is a pioneer in implementing 'thinking' budgets for medical reasoning simulations.",
      image: "https://i.pravatar.cc/150?u=BilalRaza",
      social: {
        linkedin: "https://linkedin.com",
        email: "bilal@syanmed.tech",
        twitter: "https://twitter.com"
      },
      highlights: [
        "Lead developer for the DiagnoseRight AI engine",
        "Specialist in RAG (Retrieval-Augmented Generation) for medicine",
        "Open-source contributor to several medical AI libraries"
      ],
      expertise: ["Machine Learning", "LLM Fine-tuning", "Diagnostic AI"]
    },
    {
      id: "f5",
      name: "Dr. Zainab Ali",
      role: "Director of Outreach",
      dept: "Faculty Support",
      category: 'Medical',
      accent: 'text-syan-coral',
      bgAccent: 'bg-syan-coral/10',
      shortBio: "Oversees our clinical scholarship programs and institutional relations.",
      fullBio: "Dr. Zainab Ali manages the ecosystem's relationships with global medical institutions. Her background in clinical practice and hospital administration allows her to understand the logistical hurdles of adopting new technology. She also leads our social impact initiatives, ensuring that talent regardless of background has access to our tools.",
      image: "https://i.pravatar.cc/150?u=ZainabAli",
      social: {
        linkedin: "https://linkedin.com",
        email: "zainab@syanmed.tech"
      },
      highlights: [
        "Established partnerships with 20+ top-tier medical schools",
        "Founder of the SYAN Clinical Scholarship Fund",
        "Expert in institutional change management"
      ],
      expertise: ["Institutional Relations", "Outreach", "Medical Management"]
    },
    {
      id: "f6",
      name: "Dr. Hassan",
      role: "Content Strategist",
      dept: "Clinical Pedagogy",
      category: 'Medical',
      accent: 'text-syan-coral',
      bgAccent: 'bg-syan-coral/10',
      shortBio: "Curates high-yield clinical content for modular medical education.",
      fullBio: "Dr. Hassan is responsible for the integrity and quality of the content within our LMS and Exam modules. He works with subject matter experts to create high-yield clinical cases that accurately reflect the complexity of modern medicine. He ensures that our question banks are updated weekly with the latest clinical guidelines.",
      image: "https://i.pravatar.cc/150?u=DrHassan",
      social: {
        linkedin: "https://linkedin.com",
        email: "hassan@syanmed.tech"
      },
      highlights: [
        "Curated 10,000+ board-style questions",
        "Developer of the High-Yield Modular Curriculum",
        "Liaison for specialty board content synchronization"
      ],
      expertise: ["Content Strategy", "Clinical Curriculum", "Item Writing"]
    }
  ];

  return (
    <div className="bg-[#F6F8F9] min-h-screen">
      {/* Hero Header */}
      <section className="bg-white py-24 px-6 lg:px-20 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none medical-grid"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionLabel num="04" text="Institutional Faculty" />
          <h1 className="serif text-5xl lg:text-7xl text-syan-dark mb-8 leading-[1.1] tracking-tight">
            The Architects of <span className="text-syan-coral">Clinical</span> <span className="text-[#2C7B71] italic">Innovation</span>.
          </h1>
          <p className="text-gray-400 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
            A specialized hybrid of medical practitioners and technology pioneers engineering the next generation of healthcare tools.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 lg:py-32 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {faculty.map((member) => (
              <div 
                key={member.id} 
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:-translate-y-1 hover:border-syan-coral transition-all duration-300 relative overflow-hidden"
              >
                {/* Category Pill */}
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${member.bgAccent} ${member.accent}`}>
                  {member.category}
                </div>

                {/* Card Top: Avatar + Info */}
                <div className="mb-6 flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden ring-4 ring-gray-50 group-hover:ring-syan-teal/10">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="serif text-xl text-syan-dark group-hover:text-syan-teal transition-colors truncate">{member.name}</h3>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-0.5">{member.role}</p>
                  </div>
                </div>

                {/* Short Bio */}
                <div className="flex-grow">
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {member.shortBio}
                  </p>
                </div>

                {/* Footer: Socials + View More */}
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex space-x-3">
                      {member.social.linkedin && (
                        <a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noreferrer" 
                          aria-label={`LinkedIn for ${member.name}`}
                          className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-syan-teal hover:bg-syan-teal/10 transition-all"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                      )}
                      {member.social.email && (
                        <a 
                          href={`mailto:${member.social.email}`} 
                          aria-label={`Email for ${member.name}`}
                          className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-syan-teal hover:bg-syan-teal/10 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </a>
                      )}
                   </div>
                   <button 
                    onClick={() => setSelectedMember(member)}
                    className="px-4 py-2 bg-syan-teal text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-syan-dark transition-all focus:ring-2 focus:ring-syan-teal focus:ring-offset-2"
                   >
                     View more
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Section */}
      <section className="py-24 px-6 lg:px-20 bg-syan-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 medical-grid"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-syan-sky mb-10 opacity-80">Strategic Council</p>
          <h2 className="serif text-4xl lg:text-6xl mb-12">Global Collaborative Research Hub.</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 filter grayscale hover:grayscale-0 transition-all">
             <div className="text-xl font-black italic tracking-tighter">MEDINSTITUTE</div>
             <div className="text-xl font-black italic tracking-tighter">CLINIC_NODE</div>
             <div className="text-xl font-black italic tracking-tighter">TECH_FOUNDRY</div>
             <div className="text-xl font-black italic tracking-tighter">GLOBAL_HEALTH</div>
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-24 px-6 lg:px-20 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
           <div>
              <SectionLabel num="05" text="Careers & Research" />
              <h2 className="serif text-4xl lg:text-5xl text-syan-dark mb-6">Join the <span className="text-syan-teal">Ecosystem</span>.</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">
                We are constantly expanding our clinical and engineering teams. If you are passionate about medical education and scalable technology, we invite you to explore our open roles.
              </p>
              <button className="px-12 py-5 bg-syan-dark text-white rounded-md text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-syan-teal transition-all">
                Explore Open Positions
              </button>
           </div>
           <div className="bg-syan-gray/50 rounded-[3rem] p-12 lg:p-16 border border-gray-100">
              <div className="space-y-8">
                 {[
                   { label: "Engineering", count: "03 Openings", color: "text-syan-yellow" },
                   { label: "Clinical Strategy", count: "01 Opening", color: "text-syan-coral" },
                   { label: "Research Associate", count: "02 Openings", color: "text-syan-teal" }
                 ].map((job, i) => (
                   <div key={i} className="flex justify-between items-center group cursor-pointer">
                      <div>
                        <p className="text-lg font-black text-syan-dark group-hover:text-syan-teal transition-colors">{job.label}</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${job.color}`}>{job.count}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-syan-teal group-hover:border-syan-teal group-hover:text-white transition-all">
                         →
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* MODAL POPUP */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-syan-dark/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header/Top */}
            <div className="p-8 lg:p-12 pb-6 flex justify-between items-start border-b border-gray-50 bg-syan-gray/30">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                  <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 ${selectedMember.bgAccent} ${selectedMember.accent}`}>
                    {selectedMember.category}
                   </div>
                   <h2 className="serif text-3xl lg:text-4xl text-syan-dark leading-tight">{selectedMember.name}</h2>
                   <p className="text-xs lg:text-sm font-black uppercase tracking-[0.2em] text-gray-400 mt-1">{selectedMember.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all text-gray-400 hover:text-syan-dark shadow-sm"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-8 lg:p-12 pt-8 no-scrollbar">
              <div className="space-y-10">
                {/* Full Bio */}
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-syan-teal mb-4 border-b border-syan-teal/10 pb-2">Professional Profile</h4>
                   <p className="text-gray-600 text-sm lg:text-base leading-relaxed font-medium">
                    {selectedMember.fullBio}
                   </p>
                </div>

                {/* Highlights */}
                {selectedMember.highlights && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-syan-teal mb-4 border-b border-syan-teal/10 pb-2">Key Accomplishments</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMember.highlights.map((h, i) => (
                        <li key={i} className="flex items-start space-x-3 text-xs lg:text-sm font-bold text-gray-500">
                          <span className="text-syan-yellow mt-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expertise */}
                {selectedMember.expertise && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-syan-teal mb-4 border-b border-syan-teal/10 pb-2">Core Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.expertise.map((e, i) => (
                        <span key={i} className="px-3 py-1.5 bg-syan-gray text-syan-teal text-[10px] font-black uppercase tracking-wider rounded-lg border border-gray-100">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Row repeated */}
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {selectedMember.social.linkedin && (
                      <a href={selectedMember.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-syan-teal hover:text-syan-coral transition-colors group">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedMember.social.email && (
                      <a href={`mailto:${selectedMember.social.email}`} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-syan-teal hover:text-syan-coral transition-colors group">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-syan-coral animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default PublicTeam;
