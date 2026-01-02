
import React, { useState, useEffect } from 'react';
import { pageEditorService, PageBlock, BlockType, DEFAULT_STRUCTURE } from '../services/pageEditor.ts';
import { ICONS, SectionLabel } from '../constants.tsx';
import { RichTextEditor } from '../components/RichTextEditor.tsx';

interface WidgetDef {
  type: BlockType;
  label: string;
  icon: any;
}

const WIDGETS: Record<string, WidgetDef[]> = {
  'Layout': [
    { type: 'hero', label: 'Hero Section', icon: ICONS.AI },
    { type: 'divider', label: 'ECG Divider', icon: ICONS.Publication },
    { type: 'spacer', label: 'Spacer', icon: ICONS.Notes },
  ],
  'Basic': [
    { type: 'heading', label: 'Heading', icon: ICONS.Notes },
    { type: 'text', label: 'Text Editor', icon: ICONS.Notes },
    { type: 'image', label: 'Image', icon: ICONS.Publication },
    { type: 'video', label: 'Video', icon: ICONS.AI },
    { type: 'cta', label: 'Button', icon: ICONS.Clinic },
  ],
  'Medical Pro': [
    { type: 'blog-teaser', label: 'Research Registry', icon: ICONS.Publication },
    { type: 'service-grid', label: 'Ecosystem Hub', icon: ICONS.Education },
    { type: 'impact-stat', label: 'Social Impact', icon: ICONS.Scholarship },
    { type: 'cta-banner', label: 'Global Portfolio', icon: ICONS.Clinic },
  ],
  'General': [
    { type: 'footer', label: 'Global Footer', icon: ICONS.Clinic },
  ]
};

const AdminPageEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    const data = await pageEditorService.getDraft();
    setBlocks(data);
    setLoading(false);
  };

  const handleUpdateBlock = (id: string, content: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
    setSaveStatus('idle');
  };

  const addBlock = (type: BlockType) => {
    const newBlock: PageBlock = {
      id: `block-${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: blocks.length,
      content: getDefaultContent(type)
    };
    setBlocks([...blocks, newBlock].sort((a, b) => a.order - b.order));
    setActiveBlockId(newBlock.id);
  };

  const getDefaultContent = (type: BlockType) => {
    const match = DEFAULT_STRUCTURE.find(b => b.type === type);
    if (match) return JSON.parse(JSON.stringify(match.content)); // Deep copy
    
    switch (type) {
      case 'hero': return { label: "01 // INTRODUCTION", headline: "Medical Reimagined.", subheadline: "Details...", buttonText: "Demo", vitals: [] };
      case 'blog-teaser': return { headline: "Latest Research", items: [] };
      default: return { headline: "New Block", subheadline: "Content details..." };
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    await pageEditorService.saveDraft(blocks);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handlePublish = async () => {
    if (confirm("Push these changes to the live production environment?")) {
      setSaveStatus('saving');
      await pageEditorService.publish(blocks);
      setSaveStatus('saved');
      alert("Live site synchronized.");
    }
  };

  if (loading) return <div className="h-screen bg-white flex items-center justify-center font-black uppercase text-xs tracking-widest text-syan-teal">Loading Canvas...</div>;

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row bg-[#F0F0F0] overflow-hidden text-[#161C24]">
      {/* Sidebar - Collapsible on small screens */}
      <aside className={`w-80 bg-white border-r border-[#D5D5D5] flex flex-col z-50 shadow-2xl transition-transform duration-300 hidden md:flex`}>
        <div className="p-4 border-b border-[#D5D5D5] bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#333]">Visual Editor</h2>
            <div className="flex space-x-2">
              <button onClick={handleSave} className="text-[10px] font-bold text-syan-teal">
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Draft'}
              </button>
              <button onClick={handlePublish} className="text-[10px] font-bold bg-syan-teal text-white px-2 py-1 rounded">Publish Live</button>
            </div>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Widget..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E0E0E0] rounded px-8 py-2 text-xs outline-none focus:border-syan-teal"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar pb-10">
          {Object.entries(WIDGETS).map(([category, items]) => {
            const filtered = items.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()));
            if (filtered.length === 0) return null;
            return (
              <div key={category} className="border-b border-[#EEE]">
                <button className="w-full px-4 py-2 flex items-center justify-between bg-white hover:bg-gray-50 group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-syan-teal">{category}</span>
                </button>
                <div className="grid grid-cols-2 p-3 gap-3 bg-[#F9F9F9]">
                  {filtered.map(widget => (
                    <button 
                      key={widget.type}
                      onClick={() => addBlock(widget.type)}
                      className="bg-white border border-[#DDD] hover:border-syan-teal hover:shadow-md p-4 rounded flex flex-col items-center justify-center space-y-2 group transition-all"
                    >
                      <widget.icon className="w-5 h-5 text-gray-400 group-hover:text-syan-teal" />
                      <span className="text-[9px] font-medium text-[#666] group-hover:text-[#333] text-center">{widget.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
           <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${previewMode === 'desktop' ? 'bg-white text-syan-teal shadow-sm' : 'text-gray-400'}`}>Desktop</button>
                <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${previewMode === 'mobile' ? 'bg-white text-syan-teal shadow-sm' : 'text-gray-400'}`}>Mobile</button>
              </div>
              <span className="text-[10px] font-bold text-gray-400 italic">Editing Draft Entry...</span>
           </div>
           
           <div className="flex items-center space-x-4 md:hidden">
              <button onClick={handleSave} className="text-[10px] font-bold text-syan-teal">Save</button>
              <button onClick={handlePublish} className="text-[10px] font-bold bg-syan-teal text-white px-2 py-1 rounded">Publish</button>
           </div>
        </div>

        {/* Main Canvas */}
        <main className="flex-grow overflow-y-auto bg-[#F0F0F0] p-4 lg:p-10 relative no-scrollbar flex justify-center items-start">
          <div className={`w-full transition-all duration-500 bg-white shadow-2xl min-h-screen relative border border-[#DDD] ${previewMode === 'mobile' ? 'preview-mobile' : 'max-w-[1200px]'}`}>
            {blocks.map((block) => (
              <div 
                key={block.id}
                onClick={() => setActiveBlockId(block.id)}
                className={`relative transition-all border-b border-gray-50 last:border-none ${activeBlockId === block.id ? 'ring-2 ring-syan-teal z-10' : 'hover:bg-gray-50/10'}`}
              >
                <div className="absolute top-4 right-4 z-20 flex space-x-2">
                  {activeBlockId === block.id && (
                     <button onClick={(e) => { e.stopPropagation(); setBlocks(prev => prev.filter(b => b.id !== block.id)); }} className="p-1.5 bg-red-500 text-white rounded shadow-lg">
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                     </button>
                  )}
                </div>

                {block.type === 'hero' && (
                  <div className={`py-12 lg:py-20 px-6 lg:px-10 grid gap-10 items-center ${previewMode === 'mobile' ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
                    <div className={previewMode === 'mobile' ? 'text-center' : ''}>
                      <p contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, label: e.currentTarget.textContent })} className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 outline-none">{block.content.label}</p>
                      <h1 contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, headline: e.currentTarget.textContent })} className={`${previewMode === 'mobile' ? 'text-2xl' : 'text-4xl'} font-black mb-6 outline-none uppercase tracking-tight`}>{block.content.headline}</h1>
                      <p contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, subheadline: e.currentTarget.textContent })} className="text-gray-500 text-sm max-w-lg mb-8 outline-none mx-auto lg:mx-0">{block.content.subheadline}</p>
                      <button className="bg-syan-teal text-white px-8 py-3 rounded-md text-[10px] font-black uppercase tracking-widest">{block.content.buttonText}</button>
                    </div>
                    
                    <div className={`bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-xl max-w-sm ${previewMode === 'mobile' ? 'mx-auto' : 'ml-auto'}`}>
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.3em] mb-6">Clinical Vitals</p>
                      <div className="space-y-6">
                        {(block.content.vitals || []).map((stat: any, i: number) => (
                          <div key={i} className="flex justify-between items-center group/v">
                            <div>
                              <p contentEditable onBlur={(e) => {
                                const nv = [...block.content.vitals];
                                nv[i].value = e.currentTarget.textContent;
                                handleUpdateBlock(block.id, { ...block.content, vitals: nv });
                              }} className="text-xs font-black text-syan-dark outline-none mb-0.5">{stat.value}</p>
                              <p contentEditable onBlur={(e) => {
                                const nv = [...block.content.vitals];
                                nv[i].sub = e.currentTarget.textContent;
                                handleUpdateBlock(block.id, { ...block.content, vitals: nv });
                              }} className="text-[8px] text-gray-400 font-bold uppercase tracking-widest outline-none">{stat.sub}</p>
                            </div>
                            <button onClick={() => {
                              const nv = block.content.vitals.filter((_: any, idx: number) => idx !== i);
                              handleUpdateBlock(block.id, { ...block.content, vitals: nv });
                            }} className="opacity-0 group-hover/v:opacity-100 text-red-400 text-[10px] font-black ml-4">×</button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const nv = [...(block.content.vitals || []), { value: "New Stat", sub: "New Detail" }];
                          handleUpdateBlock(block.id, { ...block.content, vitals: nv });
                        }} className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-[8px] font-black uppercase text-gray-300 hover:text-syan-teal hover:border-syan-teal transition-all">
                          + Add Vital
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {block.type === 'blog-teaser' && (
                  <div className="py-12 lg:py-20 px-6 lg:px-10 bg-gray-50/30">
                    <h2 contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, headline: e.currentTarget.textContent })} className="text-2xl lg:text-3xl font-black mb-10 outline-none uppercase">{block.content.headline}</h2>
                    <div className={`grid gap-6 ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {block.content.items.map((item: any, i: number) => (
                        <div key={i} className="bg-white p-6 lg:p-8 border border-gray-100 rounded-2xl">
                           <h4 contentEditable onBlur={(e) => { const ni = [...block.content.items]; ni[i].title = e.currentTarget.textContent; handleUpdateBlock(block.id, { ...block.content, items: ni }); }} className="font-black text-sm mb-2 outline-none uppercase">{item.title}</h4>
                           <p contentEditable onBlur={(e) => { const ni = [...block.content.items]; ni[i].detail = e.currentTarget.textContent; handleUpdateBlock(block.id, { ...block.content, items: ni }); }} className="text-xs text-gray-400 outline-none">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === 'service-grid' && (
                  <div className="py-12 lg:py-20 bg-white">
                    <div className="text-center px-6 lg:px-10">
                      <h2 contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, orbitHeadline: e.currentTarget.textContent })} className="text-2xl lg:text-3xl font-black mb-4 outline-none uppercase">{block.content.orbitHeadline}</h2>
                      <p contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, orbitSub: e.currentTarget.textContent })} className="text-[9px] font-black uppercase tracking-[0.5em] text-syan-sky mb-20 outline-none">{block.content.orbitSub}</p>
                      
                      <div className="text-left mt-16 lg:mt-32">
                         <p className="text-[10px] font-black uppercase tracking-widest text-syan-teal mb-6 lg:mb-10">{block.content.gridLabel}</p>
                         <div className={`grid gap-4 lg:gap-8 ${previewMode === 'mobile' ? 'grid-cols-2' : 'lg:grid-cols-4'}`}>
                           {block.content.items.map((item: any, i: number) => {
                             const Icon = (ICONS as any)[item.icon] || ICONS.Clinic;
                             return (
                               <div key={i} className="p-5 border border-gray-100 rounded-[2rem] bg-white relative overflow-hidden group">
                                  <div className="absolute top-2 right-2 opacity-[0.05]">
                                    <Icon className="w-12 h-12" />
                                  </div>
                                  <div className="w-10 h-10 bg-[#F6F8F9] rounded-lg flex items-center justify-center mb-4 relative z-10">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <h4 contentEditable onBlur={(e) => { const ni = [...block.content.items]; ni[i].title = e.currentTarget.textContent; handleUpdateBlock(block.id, { ...block.content, items: ni }); }} className="font-black text-[10px] uppercase mb-2 outline-none relative z-10 tracking-tight">{item.title}</h4>
                                  <p contentEditable onBlur={(e) => { const ni = [...block.content.items]; ni[i].detail = e.currentTarget.textContent; handleUpdateBlock(block.id, { ...block.content, items: ni }); }} className="text-[9px] text-gray-400 outline-none relative z-10 leading-tight">{item.detail}</p>
                                  <div className="pt-4 border-t border-gray-50 mt-4 flex justify-between items-center relative z-10">
                                    <span className="text-[7px] font-black uppercase text-syan-teal">TECHNICAL DOCS →</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-syan-teal/10"></div>
                                  </div>
                               </div>
                             );
                           })}
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {block.type === 'impact-stat' && (
                  <div className="py-12 lg:py-20 px-6 lg:px-10 bg-syan-dark text-white">
                    <h3 contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, headline: e.currentTarget.textContent })} className="text-2xl lg:text-3xl font-black mb-10 outline-none">{block.content.headline}</h3>
                    <div className={`grid gap-4 ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {block.content.stats.map((stat: any, i: number) => (
                        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                          <p contentEditable onBlur={(e) => { const ns = [...block.content.stats]; ns[i].value = e.currentTarget.textContent; handleUpdateBlock(block.id, { ...block.content, stats: ns }); }} className={`text-xl lg:text-2xl font-black mb-1 outline-none ${stat.color}`}>{stat.value}</p>
                          <p contentEditable onBlur={(e) => { const ns = [...block.content.stats]; ns[i].label = e.currentTarget.textContent; handleUpdateBlock(block.id, { ...block.content, stats: ns }); }} className="text-[8px] font-black tracking-widest outline-none">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === 'cta-banner' && (
                  <div className="py-16 lg:py-20 px-6 lg:px-10 bg-syan-teal text-white text-center">
                     <h2 contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, headline: e.currentTarget.textContent })} className="text-2xl lg:text-4xl font-black mb-8 outline-none">{block.content.headline}</h2>
                     <button className="bg-white text-syan-dark px-10 py-3 rounded text-[10px] font-black uppercase tracking-widest">{block.content.buttonText}</button>
                  </div>
                )}
                
                {block.type === 'footer' && (
                  <div className="bg-white text-syan-dark p-6 lg:p-10 border-t border-gray-100">
                    <span className="font-black text-xs uppercase tracking-widest">SYAN MED</span>
                    <div className={`grid gap-8 mt-8 ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Email</p>
                        <p contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, email: e.currentTarget.textContent })} className="text-xs font-bold outline-none">{block.content.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Copyright</p>
                        <p contentEditable onBlur={(e) => handleUpdateBlock(block.id, { ...block.content, copyright: e.currentTarget.textContent })} className="text-xs font-bold outline-none">{block.content.copyright}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #DDD; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AdminPageEditor;
