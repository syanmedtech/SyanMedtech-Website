import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS, SectionLabel } from '../constants.tsx';

const PublicHome: React.FC = () => {
  const scrollToNodeDetail = (id: string) => {
    const element = document.getElementById(`detail-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const coreNode = { 
    title: "Dashboards", 
    icon: ICONS.Clinic, 
    id: "dashboards", 
    color: "syan-dark", 
    isCore: true, 
    detail: "High-performance institutional clinic management and reporting." 
  };
  
  const outerNodes = [
    { title: "Exams", icon: ICONS.Exam, id: "exams", color: "syan-teal", isCore: false, detail: "Secure, proctored high-stakes examination environment." },
    { title: "LMS", icon: ICONS.Education, id: "lms", color: "syan-sky", isCore: false, detail: "Modular medical learning management system." },
    { title: "AI Clinical", icon: ICONS.AI, id: "ai", color: "syan-coral", isCore: false, detail: "Gemini-powered diagnostic reasoning simulators." },
    { title: "Publications", icon: ICONS.Publication, id: "publications", color: "syan-dark", isCore: false, detail: "Digital medical research and publication repository." },
    { title: "Volunteer", icon: ICONS.Clinic, id: "volunteer", color: "syan-sky", isCore: false, detail: "Community-driven healthcare volunteer programs." },
    { title: "Scholarships", icon: ICONS.Scholarship, id: "scholarships", color: "syan-yellow", isCore: false, detail: "Medical excellence funding and scholarship portal." },
    { title: "Resources", icon: ICONS.Notes, id: "notes", color: "syan-teal", isCore: false, detail: "Structured clinical revision notes and resources." },
  ];

  return (
    <div className="bg-syan-gray min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-white px-6 lg:px-20 border-b border-syan-sky/10 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ICONS.Education className="w-[500px] h-[500px] text-syan-teal" />
        </div>
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <SectionLabel num="01" text="Introduction" />
            <div className="flex flex-wrap gap-2 mb-6">
              {['Secure', 'HIPAA Ready', 'Scalable', 'AI-Driven'].map(pill => (
                <span key={pill} className="px-3 py-1 bg-syan-teal/10 text-syan-teal text-[10px] font-bold uppercase tracking-widest rounded-full border border-syan-teal/20">
                  {pill}
                </span>
              ))}
            </div>
            <h1 className="serif text-5xl lg:text-7xl text-syan-dark leading-[1.1] tracking-tight mb-8">
              Medical <span className="italic text-syan-teal font-medium">Education</span>,<br />
              & Clinical <span className="text-syan-sky">Technology</span>.
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mb-10 leading-relaxed font-medium">
              SYAN MED Tech provides a cohesive ecosystem bridging the gap between clinical reality and academic excellence through secure, intelligent software.
            </p>
            <div className="flex items-center space-x-8">
              <Link to="/contact" className="px-10 py-4 bg-syan-teal text-white rounded-md text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-syan-teal/20 hover:bg-syan-dark transition-all transform hover:-translate-y-1">
                Request Demo
              </Link>
              <a href="#ecosystem" className="text-xs font-bold uppercase tracking-widest text-syan-sky hover:text-syan-teal transition-all flex items-center group">
                Explore Portal <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-syan-teal/5 rounded-full blur-3xl group-hover:bg-syan-sky/10 transition-colors"></div>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.3em] mb-8">Clinical Vitals</p>
              <div className="space-y-8">
                {[
                  { label: "Global Reach", value: "10k+ Students", sub: "Active Academic Users" },
                  { label: "Architecture", value: "Secure Micro-services", sub: "Production-ready scale" },
                  { label: "AI Core", value: "Gemini 3 Pro", sub: "Clinical Fine-tuning" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center group/item">
                    <div>
                      <p className="text-sm font-black text-syan-dark mb-1">{stat.value}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.sub}</p>
                    </div>
                    <div className="h-8 w-1.5 bg-syan-teal/10 group-hover/item:bg-syan-teal transition-all rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECG DIVIDER */}
      <div className="ecg-container"><div className="ecg-line animate-ecg-scan"></div></div>

      {/* ECOSYSTEM HUB SECTION */}
      <section id="ecosystem" className="orbit-container py-32 px-6 lg:px-20 bg-white border-b border-syan-sky/10 relative overflow-hidden">
        <div className="absolute inset-0 medical-grid opacity-40"></div>
        
        <div className="max-w-[1400px] mx-auto relative h-[800px] flex items-center justify-center">
          <div className="absolute top-0 left-0">
            <SectionLabel num="02" text="Ecosystem Architecture" />
          </div>
          
          <div className="text-center absolute top-12 z-40">
            <h2 className="serif text-4xl lg:text-5xl text-syan-dark mb-2">Interconnected Knowledge Mesh</h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-syan-teal opacity-60">Real-time Clinical Synchronization</p>
          </div>
          
          {/* Central Fixed Core Node */}
          <div className="absolute z-50 flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <button
              onClick={() => scrollToNodeDetail(coreNode.id)}
              className="pointer-events-auto relative flex items-center justify-center w-32 h-32 bg-syan-dark text-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(31,41,55,0.4)] border border-syan-teal/30 hover:scale-105 transition-transform duration-700 active:scale-95"
            >
              <ICONS.Clinic className="w-14 h-14 transition-transform duration-700 hover:rotate-6" />
              <div className="absolute inset-0 rounded-[2.5rem] bg-syan-teal/10 animate-ping pointer-events-none" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-0 rounded-[2.5rem] border-2 border-syan-sky/20 animate-pulse pointer-events-none"></div>
            </button>
            <div className="mt-6 text-center">
              <span className="block text-sm font-black uppercase tracking-[0.3em] text-syan-dark">{coreNode.title}</span>
              <span className="block text-[9px] uppercase font-bold tracking-[0.2em] text-syan-teal">Institutional Hub</span>
            </div>
          </div>

          {/* Orbit Layer (Rotates everything inside) */}
          <div className="animate-orbit-rotate absolute top-1/2 left-1/2 w-0 h-0 z-30">
            {outerNodes.map((node, i) => {
              const angle = i * (360 / outerNodes.length);
              return (
                <div 
                  key={node.id}
                  className="absolute top-0 left-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  {/* Dashed Connecting Line - linked between center and arm */}
                  <svg 
                    className="absolute top-0 left-0 pointer-events-none" 
                    style={{ width: 'var(--orbit-radius)', height: '4px', overflow: 'visible' }}
                  >
                    <line 
                      x1="0" y1="0" 
                      x2="var(--orbit-radius)" y2="0" 
                      stroke="#2B7A6D" 
                      strokeWidth="1.5" 
                      strokeDasharray="5 8"
                      className="opacity-20"
                    />
                    {/* Secondary animated "data" flow line */}
                    <line 
                      x1="0" y1="0" 
                      x2="var(--orbit-radius)" y2="0" 
                      stroke="#55B6C2" 
                      strokeWidth="1.5" 
                      strokeDasharray="2 40"
                      className="opacity-40 animate-[dash_2s_linear_infinite]"
                      style={{ strokeDashoffset: '100%' }}
                    />
                  </svg>

                  {/* Outer Node Container */}
                  <div 
                    style={{ transform: `translateX(var(--orbit-radius))` }}
                    className="absolute top-0 left-0"
                  >
                    {/* Counter-rotation to keep the node upright while the arm orbits */}
                    <div className="animate-counter-rotate">
                      {/* Premium Floating micro-motion */}
                      <div className="animate-float" style={{ animationDelay: `${i * 0.7}s`, animationDuration: '5s' }}>
                        <button
                          onClick={() => scrollToNodeDetail(node.id)}
                          className="flex flex-col items-center group -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
                        >
                          <div className={`
                            relative flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-700
                            group-hover:scale-110 group-hover:shadow-[0_20px_40px_rgba(43,122,109,0.15)] group-hover:border-syan-teal/40 text-${node.color}
                          `}>
                            <node.icon className="w-9 h-9 transition-transform duration-700 group-hover:rotate-12" />
                            <div className="absolute inset-0 bg-syan-teal/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                          </div>
                          
                          <div className="mt-4 text-center opacity-70 group-hover:opacity-100 transition-all duration-700 w-36">
                            <span className="block text-xs font-black uppercase tracking-[0.2em] text-syan-dark group-hover:text-syan-teal transition-colors">{node.title}</span>
                            <span className="block text-[8px] uppercase font-bold tracking-tighter text-gray-400 mt-1 group-hover:text-gray-600">Institutional Module</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DETAILS GRID - MODULE SPECIFICATIONS */}
      <section className="bg-white py-24 px-6 lg:px-20 border-b border-syan-sky/10">
        <div className="max-w-[1400px] mx-auto">
          <SectionLabel num="2.1" text="Module Specifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[coreNode, ...outerNodes].map((node) => (
              <div 
                key={node.id} 
                id={`detail-${node.id}`}
                className="p-8 border border-gray-100 rounded-2xl hover:border-syan-teal/30 transition-all group bg-white shadow-sm scroll-mt-24 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <node.icon className="w-16 h-16" />
                </div>
                {/* Fixed: node.isCore is now defined for all nodes in the mapped array */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${node.isCore ? 'bg-syan-dark text-white' : `bg-syan-gray text-${node.color} group-hover:bg-syan-teal group-hover:text-white`}`}>
                  <node.icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest text-syan-dark mb-4">{node.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">{node.detail}</p>
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-syan-teal uppercase tracking-widest cursor-pointer group-hover:translate-x-1 transition-transform inline-block">Technical Docs →</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-syan-teal/20 group-hover:bg-syan-teal transition-colors"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT DATA SECTION */}
      <section className="py-24 px-6 lg:px-20 bg-syan-dark text-white relative">
        <div className="absolute inset-0 medical-grid opacity-10"></div>
        <div className="max-w-[1400px] mx-auto relative z-10 grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5">
                <SectionLabel num="03" text="Social Impact" />
                <h3 className="serif text-5xl mb-8 leading-tight">Empowering the Future of Health.</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium">
                  SYAN MED Tech annually supports dozens of students through our internal scholarship fund and research index, ensuring innovation is accessible to all.
                </p>
                <Link to="/about" className="px-8 py-3 bg-white/5 border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest text-syan-sky hover:bg-white hover:text-syan-dark transition-all inline-block">
                  View Our Mission Report
                </Link>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 gap-6">
                {[
                    { label: "Scholarships", value: "PKR 2.5M+", color: "text-syan-sky" },
                    { label: "Research Papers", value: "15+ Indexed", color: "text-syan-coral" },
                    { label: "Data Points", value: "1.2M daily", color: "text-syan-yellow" },
                    { label: "Institutions", value: "12 National", color: "text-white" }
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:bg-white/10 transition-all">
                        <p className={`text-3xl font-black mb-2 transition-transform group-hover:scale-110 origin-left ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 lg:px-20 bg-syan-teal text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
          <ICONS.AI className="w-[1000px] h-[1000px] mx-auto text-white rotate-12" />
        </div>
        <div className="max-w-[800px] mx-auto relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-8 opacity-80">Global Collaboration Portfolio</p>
            <h2 className="serif text-5xl lg:text-6xl mb-12 leading-tight">Advancing Medical Standards Through Digital Excellence.</h2>
            <Link to="/contact" className="inline-block px-12 py-5 bg-white text-syan-teal rounded-md text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-syan-dark hover:text-white transition-all transform hover:-translate-y-1">
                Partner With Our Ecosystem
            </Link>
        </div>
      </section>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicHome;