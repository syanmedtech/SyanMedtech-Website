
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ICONS, SectionLabel } from '../constants.tsx';
import { pageEditorService, PageBlock } from '../services/pageEditor.ts';

const VitalsCard: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="bg-white p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-md relative overflow-hidden group mx-auto lg:mx-0">
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

const PublicHome: React.FC = () => {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
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
            return (
              <section key={id} className="bg-white px-6 lg:px-20 pt-16 lg:pt-20 pb-20 lg:pb-24 relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  <div className="z-10 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start">
                      <SectionLabel num={content.label?.split('//')[0] || "01"} text={content.label?.split('//')[1] || "Introduction"} />
                    </div>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                      {(content.pills || []).map((pill: string) => (
                        <span key={pill} className="px-3 py-1 bg-syan-teal/10 text-syan-teal text-[9px] font-black uppercase tracking-widest rounded-full border border-syan-teal/20">
                          {pill}
                        </span>
                      ))}
                    </div>
                    <h1 className="serif text-4xl sm:text-5xl lg:text-7xl text-syan-dark leading-[1.1] tracking-tight mb-8">
                      Medical <span className="italic text-syan-teal">Education</span>,<br />& Clinical <span className="text-syan-sky">Technology</span>.
                    </h1>
                    <p className="text-gray-500 text-base lg:text-lg max-w-lg mx-auto lg:mx-0 mb-10 lg:mb-12 leading-relaxed font-medium">
                      {content.subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-10">
                      <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-syan-teal text-white rounded-md text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-syan-teal/20 hover:bg-syan-dark transition-all transform hover:-translate-y-1 text-center">
                        {content.buttonText}
                      </Link>
                      <Link to="/diagnose-right" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-syan-teal transition-all flex items-center">
                        TRY AI SIMULATOR <span className="ml-2">→</span>
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-end">
                    {content.vitals && <VitalsCard items={content.vitals} />}
                  </div>
                </div>
              </section>
            );

          case 'blog-teaser':
            return (
              <section key={id} className="py-20 lg:py-24 px-6 lg:px-20 bg-syan-gray/30 border-t border-gray-100">
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
                           <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{item.detail}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'service-grid':
            return (
              <div key={id} className="bg-white overflow-hidden">
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

                <section className="py-20 lg:py-32 px-6 lg:px-20 bg-white border-t border-gray-50">
                  <div className="max-w-[1400px] mx-auto">
                    <div className="mb-12 lg:mb-20">
                      <SectionLabel num={content.gridLabel?.split('//')[0] || "2.1"} text={content.gridLabel?.split('//')[1] || "MODULE SPECIFICATIONS"} />
                    </div>
                    {/* Updated grid classes for 2 columns on mobile and 4 on desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                      {(content.items || []).map((node: any, i: number) => {
                        const Icon = (ICONS as any)[node.icon] || ICONS.Clinic;
                        const targetId = node.title.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <div id={`module-${targetId}`} key={i} className="bg-white p-6 lg:p-12 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col transition-all duration-500 hover:shadow-xl hover:border-syan-teal/10 group hover:-translate-y-1 relative overflow-hidden">
                            {/* Faint Outline Icon in Top Right */}
                            <div className="absolute top-4 right-4 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                              <Icon className="w-20 lg:w-24 h-20 lg:h-24" />
                            </div>
                            
                            {/* Main Icon in soft gray box */}
                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#F6F8F9] rounded-xl flex items-center justify-center text-syan-dark mb-6 lg:mb-8 transition-all duration-500 relative z-10">
                              <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            
                            <h3 className="font-black text-syan-dark text-base lg:text-lg tracking-tight uppercase mb-2 lg:mb-4 relative z-10">{node.title}</h3>
                            <p className="text-gray-400 text-[10px] lg:text-xs font-medium leading-relaxed mb-6 lg:mb-10 flex-grow relative z-10">{node.detail}</p>
                            
                            <div className="flex items-center justify-between pt-4 lg:pt-6 border-t border-gray-50 relative z-10">
                               <button className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-syan-teal flex items-center group/btn">
                                 TECHNICAL DOCS 
                                 <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
                               </button>
                               <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-syan-teal/10 group-hover:bg-syan-teal transition-colors"></div>
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
              <section key={id} className="py-20 lg:py-32 px-6 lg:px-20 bg-[#1F2937] text-white relative">
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
              <section key={id} className="py-20 lg:py-32 px-6 lg:px-20 bg-gradient-to-br from-syan-teal to-syan-dark text-white text-center relative overflow-hidden">
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

          case 'footer':
             return (
               <section key={id} className="bg-white text-syan-dark py-20 lg:py-32 px-6 lg:px-20 border-t border-gray-100">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2 mb-8 lg:mb-10">
                        <div className="w-10 h-10 bg-syan-teal rounded flex items-center justify-center">
                          <span className="text-white font-black text-xl leading-none">S</span>
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter">SYAN <span className="text-syan-teal">MED</span> Tech</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        {content.description}
                      </p>
                      <Link to="/admin" className="text-[9px] font-black uppercase tracking-widest text-syan-teal border border-syan-teal/20 px-4 py-2 rounded-full inline-block">
                        Admin Access
                      </Link>
                    </div>
                    
                    <div className="sm:pt-2">
                      <h4 className="font-black text-[10px] uppercase tracking-widest mb-6 lg:mb-10 text-gray-300">Quick Links</h4>
                      <ul className="space-y-4 text-xs font-bold text-gray-500">
                        <li><Link to="/" className="hover:text-syan-teal transition-colors">Home</Link></li>
                        <li><Link to="/services" className="hover:text-syan-teal transition-colors">Services</Link></li>
                        <li><Link to="/about" className="hover:text-syan-teal transition-colors">About Us</Link></li>
                        <li><Link to="/team" className="hover:text-syan-teal transition-colors">Our Team</Link></li>
                      </ul>
                    </div>

                    <div className="sm:pt-2">
                      <h4 className="font-black text-[10px] uppercase tracking-widest mb-6 lg:mb-10 text-gray-300">Services</h4>
                      <ul className="space-y-4 text-xs font-bold text-gray-500">
                        <li>Online Exams</li>
                        <li>Medical LMS</li>
                        <li>Clinical AI Tools</li>
                        <li>EMR Dashboards</li>
                      </ul>
                    </div>

                    <div className="sm:pt-2">
                      <h4 className="font-black text-[10px] uppercase tracking-widest mb-6 lg:mb-10 text-gray-300">Contact</h4>
                      <ul className="space-y-6 text-xs font-bold text-gray-500">
                        <li className="flex items-center space-x-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-syan-teal flex-shrink-0"></span>
                          <span className="truncate">{content.email}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-syan-sky flex-shrink-0"></span>
                          <span>{content.phone}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-syan-coral flex-shrink-0"></span>
                          <span className="truncate">{content.address}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="max-w-[1400px] mx-auto mt-20 lg:mt-32 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-center md:text-left">
                    <p className="mb-4 md:mb-0">{content.copyright}</p>
                    <div className="flex space-x-10">
                      <a href="#" className="hover:text-syan-dark">Privacy Policy</a>
                      <a href="#" className="hover:text-syan-dark">Terms of Service</a>
                    </div>
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
