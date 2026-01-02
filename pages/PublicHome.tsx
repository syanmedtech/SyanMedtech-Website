
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ICONS, SectionLabel } from '../constants.tsx';
import { pageEditorService, PageBlock } from '../services/pageEditor.ts';

const VitalsCard: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="bg-white/80 backdrop-blur-xl p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] border border-white/20 shadow-2xl w-full max-w-md relative overflow-hidden group mx-auto lg:mx-0">
    <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none transform -rotate-12">
      <ICONS.Education className="w-64 h-64 text-syan-teal" />
    </div>
    <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.3em] mb-6 lg:mb-8 relative z-10">Clinical Vitals</p>
    <div className="space-y-6 lg:space-y-8 relative z-10">
      {(items || []).map((stat: any, i: number) => (
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
);

const HeroBlock: React.FC<{ block: PageBlock }> = ({ block }) => {
  const { content, id } = block;
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = content.bgImages || [
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1557946632-4d2b6180c4c4?auto=format&fit=crop&q=80&w=2000"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds interval
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section key={id} className="relative px-6 lg:px-20 pt-20 lg:pt-32 pb-24 lg:pb-40 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {images.map((img: string, idx: number) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              idx === currentIdx ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt="Medical Tech Background"
              className="w-full h-full object-cover scale-110"
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30"></div>
          </div>
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 w-full">
        <div className="text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <SectionLabel num="01" text="Introduction" />
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
            {(content.pills || []).map((pill: string) => (
              <span key={pill} className="px-3 py-1 bg-syan-teal/10 backdrop-blur-sm text-syan-teal text-[9px] font-black uppercase tracking-widest rounded-full border border-syan-teal/20">
                {pill}
              </span>
            ))}
          </div>
          <h1 className="serif text-4xl sm:text-5xl lg:text-7xl text-syan-dark leading-[1.1] tracking-tight mb-8">
            <span className="text-syan-coral">Medical Education</span>,<br />
            <span className="text-syan-teal">& Clinical</span> <span className="text-syan-yellow">Technology</span>.
          </h1>
          <p className="text-gray-600 text-base lg:text-lg max-w-lg mx-auto lg:mx-0 mb-10 lg:mb-12 leading-relaxed font-semibold">
            {content.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-10">
            <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-syan-teal text-white rounded-md text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-syan-teal/20 hover:bg-syan-dark transition-all transform hover:-translate-y-1 text-center">
              {content.buttonText}
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          {content.vitals && <VitalsCard items={content.vitals} />}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === currentIdx 
              ? 'w-10 bg-syan-teal' 
              : 'w-2 bg-gray-300 hover:bg-syan-teal/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

const PublicHome: React.FC = () => {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      const liveBlocks = await pageEditorService.getLive();
      setBlocks(liveBlocks);
      setLoading(false);
    };
    loadData();
  }, []);

  const scrollToNodeDetail = (id: string) => {
    const targetId = id.toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(`module-${targetId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-syan-gray">
        <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-syan-teal">Initializing Ecosystem...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {blocks.map((block) => {
        const { type, content, id } = block;
        
        switch (type) {
          case 'hero':
            return <HeroBlock key={id} block={block} />;

          case 'blog-teaser':
            return (
              <section key={id} className="py-20 lg:py-24 px-6 lg:px-20 bg-syan-gray/30 border-t border-gray-100 relative z-10">
                <div className="max-w-[1400px] mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 lg:mb-16 text-center sm:text-left">
                    <div className="mb-6 sm:mb-0">
                      <SectionLabel num={content.label?.split('//')[0] || "02"} text={content.label?.split('//')[1] || "Medical Insights"} />
                      <h2 className="serif text-3xl lg:text-5xl text-syan-dark">{content.headline}</h2>
                    </div>
                    <Link to="/blogs" className="text-[10px] font-black uppercase tracking-widest text-syan-teal border-b-2 border-syan-teal pb-1">{content.linkText}</Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {(content.items || []).map((item: any, i: number) => {
                      const Icon = (ICONS as any)[item.icon] || ICONS.Publication;
                      return (
                        <div key={i} className="bg-white p-8 lg:p-12 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-6 lg:p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Icon className="w-32 lg:w-40 h-32 lg:h-40" />
                           </div>
                           <p className="text-[10px] font-black text-syan-teal tracking-[0.3em] mb-4 lg:mb-6">{item.category}</p>
                           <h3 className="serif text-2xl lg:text-3xl text-syan-dark mb-4 lg:mb-6 group-hover:text-syan-teal transition-colors">{item.title}</h3>
                           <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">{item.detail}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'service-grid':
            return (
              <div key={id} className="bg-syan-gray overflow-hidden relative z-10">
                <section className="orbit-container py-20 lg:py-32 px-6 lg:px-20 bg-white relative border-t border-gray-100">
                  <div className="max-w-[1400px] mx-auto relative h-[600px] sm:h-[700px] lg:h-[800px] flex items-center justify-center">
                    <div className="text-center absolute top-0 z-40 w-full pt-6 lg:pt-10">
                       <SectionLabel num="03 //" text="Ecosystem Architecture" />
                       <h2 className="serif text-3xl sm:text-4xl lg:text-5xl text-syan-dark mb-4">{content.orbitHeadline || "Interconnected Knowledge Mesh"}</h2>
                       <p className="text-[9px] lg:text-[10px] uppercase font-black tracking-[0.4em] lg:tracking-[0.6em] text-syan-sky opacity-80">{content.orbitSub || "REAL-TIME CLINICAL SYNCHRONIZATION"}</p>
                    </div>
                    
                    {/* Core Hub */}
                    <div className="absolute z-50 flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 bg-[#1F2937] text-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_30px_60px_rgba(31,41,55,0.4)] border border-syan-teal/20">
                        <div className="text-center p-4">
                          <ICONS.Clinic className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-4" />
                          <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] mb-1">DASHBOARDS</p>
                          <p className="hidden sm:block text-[7px] lg:text-[8px] font-bold opacity-50 uppercase tracking-widest text-center">INSTITUTIONAL HUB</p>
                        </div>
                        <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-syan-teal p-1.5 lg:p-2 rounded-lg lg:rounded-xl border-2 lg:border-4 border-white shadow-xl">
                          <svg className="w-3 h-3 lg:w-5 lg:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Orbiting Nodes */}
                    <div className="animate-orbit-rotate absolute top-1/2 left-1/2 w-0 h-0 z-30">
                      {(content.items || []).slice(1).map((node: any, i: number) => {
                        const angle = i * (360 / (content.items.length - 1));
                        const Icon = (ICONS as any)[node.icon] || ICONS.Clinic;
                        return (
                          <div key={i} className="absolute top-0 left-0" style={{ transform: `rotate(${angle}deg)` }}>
                            <div style={{ transform: `translateX(var(--orbit-radius))` }} className="absolute top-0 left-0">
                              <div className="animate-counter-rotate">
                                <div className="animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                                  <button onClick={() => scrollToNodeDetail(node.title)} className="flex flex-col items-center group -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none">
                                    <div className="relative flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-2xl lg:rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 group-hover:scale-110 group-hover:border-syan-teal/20 transition-all duration-500">
                                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-syan-teal" />
                                    </div>
                                    <div className="hidden lg:block mt-6 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
                                      <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-[#1F2937]">{node.title}</span>
                                      <span className="block text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">INSTITUTIONAL MODULE</span>
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

                <section className="py-20 lg:py-32 px-6 lg:px-20 bg-syan-gray border-t border-gray-100 relative z-10">
                  <div className="max-w-[1400px] mx-auto">
                    <div className="mb-12 lg:mb-20">
                      <SectionLabel num={content.gridLabel?.split('//')[0] || "2.1"} text={content.gridLabel?.split('//')[1] || "MODULE SPECIFICATIONS"} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                      {(content.items || []).map((node: any, i: number) => {
                        const Icon = (ICONS as any)[node.icon] || ICONS.Clinic;
                        const targetId = node.title.toLowerCase().replace(/\s+/g, '-');
                        const isEven = i % 2 === 0;
                        return (
                          <div 
                            id={`module-${targetId}`} 
                            key={i} 
                            className={`p-8 lg:p-12 rounded-3xl border border-syan-teal/5 shadow-sm flex flex-col transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(44,123,113,0.1)] hover:border-syan-coral group relative bg-white`}
                          >
                            <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                              <Icon className="w-16 lg:w-20 h-16 lg:h-20" />
                            </div>
                            {/* Icon Container with tinted background based on color family */}
                            <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-syan-teal mb-8 lg:mb-10 transition-all duration-300 ${
                              isEven
                                ? 'bg-syan-teal/[0.08] group-hover:bg-syan-teal/[0.12]'
                                : 'bg-syan-yellow/[0.08] group-hover:bg-syan-yellow/[0.12]'
                            }`}>
                              <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
                            </div>
                            {/* Title with Coral Pink hover transition */}
                            <h3 className="font-black text-syan-teal text-lg tracking-tighter uppercase mb-3 lg:mb-4 group-hover:text-syan-coral transition-colors duration-300">
                              {node.title}
                            </h3>
                            <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-8 lg:mb-12 flex-grow">
                              {node.detail}
                            </p>
                            
                            <div className="flex items-center justify-between pt-6 lg:pt-8 border-t border-gray-100/50">
                               <button className="text-[9px] font-black uppercase tracking-widest text-syan-teal flex items-center group/btn group-hover:text-syan-coral transition-colors duration-300">
                                 TECHNICAL DOCS 
                                 <span className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                               </button>
                               <div className="w-2 h-2 rounded-full bg-syan-teal/10 group-hover:bg-syan-coral transition-colors duration-300"></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            );

          case 'impact-stat':
            return (
              <section key={id} className="py-20 lg:py-32 px-6 lg:px-20 bg-[#1F2937] text-white relative z-10">
                <div className="absolute inset-0 medical-grid opacity-5"></div>
                <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                  <div className="text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start">
                      <SectionLabel num={content.label || "04 //"} text="Impact Architecture" />
                    </div>
                    <h3 className="serif text-4xl sm:text-5xl lg:text-6xl mb-8 lg:mb-10 leading-tight tracking-tight">{content.headline}</h3>
                    <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-10 lg:mb-12 font-medium max-w-lg mx-auto lg:mx-0">{content.subheadline}</p>
                    <button className="px-10 py-4 border border-white/20 rounded-md text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-syan-dark transition-all">
                      {content.buttonText}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    {(content.stats || []).map((stat: any, i: number) => (
                      <div key={i} className="p-8 lg:p-10 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm group hover:bg-white/10 transition-all duration-500">
                        <p className={`text-3xl lg:text-4xl font-black mb-4 transition-transform group-hover:scale-110 origin-left tracking-tighter ${stat.color}`}>{stat.value}</p>
                        <p className="text-[8px] lg:text-[9px] uppercase font-black tracking-[0.3em] text-gray-500 group-hover:text-gray-300 transition-colors">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'cta-banner':
            return (
              <section key={id} className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-br from-syan-teal to-syan-dark text-white text-center relative overflow-hidden z-10">
                <div className="absolute inset-0 opacity-10 medical-grid"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-syan-sky mb-8 lg:mb-10 opacity-80">{content.label}</p>
                   <h2 className="serif text-4xl sm:text-5xl lg:text-7xl mb-10 lg:mb-12 leading-tight tracking-tight">{content.headline}</h2>
                   <button className="w-full sm:w-auto px-12 py-5 bg-white text-syan-dark rounded-md text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all">
                      {content.buttonText}
                   </button>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default PublicHome;
