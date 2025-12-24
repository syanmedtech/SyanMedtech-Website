
import React, { useState, useEffect } from 'react';
import { db } from '../services/firestore.ts';
import { seoService, SEOAnalysisResult, SEOCheck, DetailedAISuggestions } from '../services/seo.ts';
import { ICONS } from '../constants.tsx';
import { RichTextEditor } from '../components/RichTextEditor.tsx';
import { GoogleGenAI, Type } from "@google/genai";

type Tab = 'content' | 'seo' | 'metadata' | 'analytics' | 'revisions';
type SEOFilter = 'all' | 'basic' | 'title' | 'readability';

const SERPPreview: React.FC<{ title: string; url: string; description: string }> = ({ title, url, description }) => (
  <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm max-w-xl">
    <div className="flex items-center space-x-2 mb-1">
      <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[8px]">S</div>
      <span className="text-[12px] text-[#202124]">syanmed.tech › blogs › {url || 'slug'}</span>
    </div>
    <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1 font-medium">
      {title || 'Enter a title to see preview'}
    </h3>
    <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
      {description || 'Provide a meta description to see how your content appears in Google search results.'}
    </p>
  </div>
);

const SEOAuditItem: React.FC<{ check: SEOCheck }> = ({ check }) => {
  const [isOpen, setIsOpen] = useState(check.status === 'error');
  return (
    <div className="border-b border-gray-50 last:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between group transition-colors hover:bg-gray-50/50 px-2 rounded-lg"
      >
        <div className="flex items-center space-x-4">
          <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${
            check.status === 'success' ? 'text-green-500' : 'text-red-500'
          }`}>
            {check.status === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )}
          </div>
          <span className={`text-sm font-bold ${check.status === 'success' ? 'text-syan-dark' : 'text-syan-dark opacity-90'}`}>{check.title}</span>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-11 pb-5 pt-1 animate-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-lg">{check.description}</p>
        </div>
      )}
    </div>
  );
};

const DEFAULT_BLOG_DATA = {
  title: '', 
  author: 'Dr. S. Yan', 
  content: '', 
  status: 'Draft',
  slug: '',
  media: [] as any[],
  seo: { focusKeyword: '', seoTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
  social: { ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image' },
};

const AdminBlogs: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [seoFilter, setSeoFilter] = useState<SEOFilter>('all');
  
  const [blogData, setBlogData] = useState(DEFAULT_BLOG_DATA);
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysisResult>({ score: 0, errors: { basic: 0, title: 0, readability: 0 }, checks: [] });
  const [detailedAiSuggestions, setDetailedAiSuggestions] = useState<DetailedAISuggestions | null>(null);
  const [analyticsResult, setAnalyticsResult] = useState<any>(null);
  const [revisions, setRevisions] = useState<any[]>([]);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    const data = await db.list('blogs');
    setPosts(data.length ? data : []);
  };

  const loadRevisions = async (id: string) => {
    const data = await db.get('seo_revisions', id) || [];
    setRevisions(data);
  };

  const loadAiSuggestions = async (id: string) => {
    const data = await db.get('seo/aiSuggestions', id);
    if (data) setDetailedAiSuggestions(data);
  };

  const handleLiveSEO = (data = blogData) => {
    const result = seoService.calculateScore(data.content, data.title, data.seo?.focusKeyword || '');
    setSeoAnalysis(result);
  };

  const handleAiPillarCompose = async () => {
    if (!blogData.title || !blogData.seo.focusKeyword) {
      alert("Please enter a Title and Focus Keyword first.");
      return;
    }
    setIsAiProcessing(true);
    const content = await seoService.generatePillarPost(blogData.title, blogData.seo.focusKeyword);
    if (content) {
      const newData = { ...blogData, content };
      setBlogData(newData);
      handleLiveSEO(newData);
    }
    setIsAiProcessing(false);
  };

  const handleGetDetailedSeoAnalysis = async () => {
    if (!blogData.content || !blogData.seo.focusKeyword) {
      alert("Please enter content and a focus keyword first.");
      return;
    }
    setIsAiProcessing(true);
    const suggestions = await seoService.analyzeContentDetailed(blogData.content, blogData.title, blogData.seo.focusKeyword);
    if (suggestions) {
      setDetailedAiSuggestions(suggestions);
      if (editingId) {
        await db.save('seo/aiSuggestions', editingId, suggestions);
      }
    }
    setIsAiProcessing(false);
  };

  const handlePredictAnalytics = async () => {
    setIsAiProcessing(true);
    const res = await seoService.predictAnalytics(blogData.content, blogData.title);
    setAnalyticsResult(res);
    setIsAiProcessing(false);
  };

  const handleGenerateSocialMeta = async () => {
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Generate an OpenGraph Title and Meta Description for: ${blogData.title}. Focus Keyword: ${blogData.seo.focusKeyword}. Context: ${blogData.content.substring(0, 400)}. Return JSON.`;
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['title', 'description']
          }
        }
      });
      const data = JSON.parse(res.text || '{}');
      setBlogData({
        ...blogData,
        social: { ...blogData.social, ogTitle: data.title || blogData.title, ogDescription: data.description || '' }
      });
    } catch (e) {
      console.error(e);
    }
    setIsAiProcessing(false);
  };

  const saveBlog = async () => {
    const id = editingId || Math.random().toString(36).substr(2, 9);
    const existing = await db.get('blogs', id);
    let summary = "Revision saved.";
    if (existing) {
       summary = await seoService.generateRevisionSummary(existing.content, blogData.content);
    }
    await db.save('blogs', id, { ...blogData, id, aiSummary: summary });
    
    // Also save the AI suggestions if they were generated during this session
    if (detailedAiSuggestions) {
      await db.save('seo/aiSuggestions', id, detailedAiSuggestions);
    }

    await loadPosts();
    setIsAdding(false);
  };

  const openEditor = (post: any = null) => {
    if (post) {
      setEditingId(post.id);
      setBlogData({ ...DEFAULT_BLOG_DATA, ...post });
      loadRevisions(post.id);
      loadAiSuggestions(post.id);
    } else {
      setEditingId(null);
      setBlogData(DEFAULT_BLOG_DATA);
      setRevisions([]);
      setDetailedAiSuggestions(null);
      setAnalyticsResult(null);
    }
    setActiveTab('content');
    setIsAdding(true);
    handleLiveSEO(post || DEFAULT_BLOG_DATA);
  };

  const filteredChecks = seoFilter === 'all' ? seoAnalysis.checks : seoAnalysis.checks.filter(c => c.category === seoFilter);

  const applyAISuggestion = (type: 'title' | 'meta' | 'h1') => {
    if (!detailedAiSuggestions) return;
    if (type === 'title') {
      setBlogData(prev => ({ ...prev, seo: { ...prev.seo, seoTitle: detailedAiSuggestions.optimizedTitle } }));
    } else if (type === 'meta') {
      setBlogData(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: detailedAiSuggestions.metaDescription } }));
    } else if (type === 'h1') {
      setBlogData(prev => ({ ...prev, title: detailedAiSuggestions.suggestedHeadings.h1 }));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-syan-dark tracking-tight uppercase">Registry Access</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Medical AI-CMS & TruSEO™ Integration.</p>
        </div>
        <button onClick={() => openEditor()} className="px-8 py-3.5 bg-syan-teal text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
          Compose Insight
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-syan-dark/95 backdrop-blur-md" onClick={() => setIsAdding(false)}></div>
          <div className="relative w-full max-w-7xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            
            <div className="px-10 pt-8 border-b border-gray-100 bg-syan-gray/20">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-6">
                   <h2 className="text-xl font-black text-syan-dark uppercase tracking-widest">Medical Insight Console</h2>
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${seoAnalysis.score > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    SEO Health: {seoAnalysis.score}%
                   </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={saveBlog} className="px-8 py-2.5 bg-syan-teal text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-syan-dark transition-colors shadow-lg">Commit To Registry</button>
                </div>
              </div>
              
              <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                {(['content', 'seo', 'metadata', 'analytics', 'revisions'] as Tab[]).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-syan-teal text-syan-teal' : 'border-transparent text-gray-400'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-10 bg-white">
              {activeTab === 'content' && (
                <div className="space-y-8 max-w-6xl">
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-9">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Primary Title</label>
                      <input type="text" value={blogData.title} onChange={(e) => { const newData={...blogData, title:e.target.value}; setBlogData(newData); handleLiveSEO(newData); }} className="w-full px-6 py-5 bg-syan-gray border border-gray-100 rounded-2xl font-bold text-lg serif outline-none focus:border-syan-teal" placeholder="e.g. Advancements in Pediatric Genomic Sequencing" />
                    </div>
                    <div className="md:col-span-3 pt-6">
                       <button onClick={handleAiPillarCompose} disabled={isAiProcessing} className="w-full h-full bg-syan-dark text-syan-sky rounded-2xl flex items-center justify-center space-x-2 font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50">
                          {isAiProcessing ? <span className="animate-pulse">Synthesizing...</span> : <span>✨ Compose Pillar Post</span>}
                       </button>
                    </div>
                  </div>
                  <div className="h-[600px] flex flex-col">
                    <RichTextEditor value={blogData.content} onChange={(val) => { const newData={...blogData, content:val}; setBlogData(newData); handleLiveSEO(newData); }} placeholder="Draft clinical content..." />
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 space-y-10">
                    <SERPPreview title={blogData.seo.seoTitle || blogData.title} url={blogData.slug} description={blogData.seo.metaDescription} />
                    
                    {/* AI SEO Assistant Panel */}
                    <div className="bg-syan-dark p-10 rounded-[2.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <ICONS.AI className="w-64 h-64" />
                      </div>
                      
                      <div className="flex justify-between items-center relative z-10">
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-syan-sky">TruSEO™ AI Assistant</h4>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Semantic & Structural Intelligence</p>
                        </div>
                        <button 
                          onClick={handleGetDetailedSeoAnalysis} 
                          disabled={isAiProcessing} 
                          className="px-6 py-2.5 bg-syan-teal text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-syan-teal transition-all shadow-xl disabled:opacity-50"
                        >
                          {isAiProcessing ? <span className="flex items-center"><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Analyzing...</span> : 'Run Deep Audit'}
                        </button>
                      </div>
                      
                      {detailedAiSuggestions ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 group">
                                <p className="text-[10px] text-syan-sky font-black uppercase mb-3 flex justify-between items-center">
                                  Optimized Title
                                  <button onClick={() => applyAISuggestion('title')} className="text-[8px] bg-syan-sky/20 px-2 py-0.5 rounded hover:bg-syan-sky hover:text-white transition-all">Apply</button>
                                </p>
                                <p className="text-xs font-medium text-gray-300 leading-relaxed italic">"{detailedAiSuggestions.optimizedTitle}"</p>
                              </div>
                              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 group">
                                <p className="text-[10px] text-syan-sky font-black uppercase mb-3 flex justify-between items-center">
                                  Meta Description
                                  <button onClick={() => applyAISuggestion('meta')} className="text-[8px] bg-syan-sky/20 px-2 py-0.5 rounded hover:bg-syan-sky hover:text-white transition-all">Apply</button>
                                </p>
                                <p className="text-xs font-medium text-gray-300 leading-relaxed italic">"{detailedAiSuggestions.metaDescription}"</p>
                              </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                              <p className="text-[10px] text-syan-sky font-black uppercase mb-4">Semantic Hierarchy</p>
                              <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                  <span className="text-[8px] font-black bg-white/10 px-1.5 py-0.5 rounded text-gray-400">H1</span>
                                  <p className="text-[11px] font-bold text-gray-200">{detailedAiSuggestions.suggestedHeadings.h1}</p>
                                </div>
                                <div className="space-y-2">
                                  {detailedAiSuggestions.suggestedHeadings.h2.slice(0, 3).map((h, i) => (
                                    <div key={i} className="flex items-start space-x-3 ml-2">
                                      <span className="text-[8px] font-black bg-white/5 px-1.5 py-0.5 rounded text-gray-500">H2</span>
                                      <p className="text-[10px] font-medium text-gray-400">{h}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                            <div>
                              <p className="text-[10px] text-syan-sky font-black uppercase mb-3 flex items-center">
                                <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
                                Keyword Density
                              </p>
                              <p className="text-[11px] text-gray-300 leading-relaxed font-medium">{detailedAiSuggestions.keywordDensityFeedback}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-syan-sky font-black uppercase mb-3 flex items-center">
                                <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM7 4a1 1 0 000 2H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-1a1 1 0 100-2H7zM8 8a1 1 0 112 0v2a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v2a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>
                                Readability Audit
                              </p>
                              <ul className="space-y-2">
                                {detailedAiSuggestions.readabilitySuggestions.map((s, i) => (
                                  <li key={i} className="text-[10px] text-gray-400 flex items-start">
                                    <span className="text-syan-sky mr-2">•</span>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-3xl relative z-10">
                          <p className="text-xs text-gray-400 italic">Trigger a deep audit to unlock clinical SEO intelligence.</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6 bg-syan-gray/50 p-10 rounded-[2.5rem] border border-gray-100">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Focus Keyword</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={blogData.seo.focusKeyword} 
                            onChange={(e) => { const newData={...blogData, seo:{...blogData.seo, focusKeyword: e.target.value}}; setBlogData(newData); handleLiveSEO(newData); }} 
                            className="w-full px-8 py-5 bg-white border border-gray-100 rounded-2xl outline-none shadow-sm focus:border-syan-teal text-sm font-bold" 
                            placeholder="e.g. Clinical Genomics" 
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-syan-teal">
                            <ICONS.Exam className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-5 flex flex-col bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm h-[700px]">
                    <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                      <div className="flex space-x-8">
                        {['all', 'basic', 'title', 'readability'].map(f => (
                          <button key={f} onClick={() => setSeoFilter(f as any)} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${seoFilter === f ? 'border-syan-teal text-syan-teal' : 'border-transparent text-gray-400'}`}>{f}</button>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-syan-teal animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase text-gray-400">Live Audit</span>
                      </div>
                    </div>
                    <div className="flex-grow overflow-y-auto px-10 py-6 no-scrollbar">
                      {filteredChecks.map((c, i) => <SEOAuditItem key={i} check={c} />)}
                      {filteredChecks.length === 0 && (
                        <div className="py-20 text-center text-gray-300 uppercase font-black text-xs tracking-widest">No issues detected</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                       <h3 className="text-sm font-black text-syan-dark uppercase tracking-widest">Social Metadata</h3>
                       <button onClick={handleGenerateSocialMeta} disabled={isAiProcessing} className="text-[10px] font-black text-syan-teal uppercase tracking-widest bg-syan-teal/5 px-4 py-1.5 rounded-full hover:bg-syan-teal hover:text-white transition-all">
                        {isAiProcessing ? 'Synthesizing...' : '✨ Synthesize Social Meta'}
                       </button>
                    </div>
                    <div className="space-y-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                      <input type="text" placeholder="OG Title" value={blogData.social.ogTitle} className="w-full px-6 py-4 bg-syan-gray border rounded-2xl outline-none" onChange={(e) => setBlogData({...blogData, social: {...blogData.social, ogTitle: e.target.value}})} />
                      <textarea placeholder="OG Description" rows={4} value={blogData.social.ogDescription} className="w-full px-6 py-4 bg-syan-gray border rounded-2xl outline-none" onChange={(e) => setBlogData({...blogData, social: {...blogData.social, ogDescription: e.target.value}})} />
                    </div>
                  </div>
                  <div className="bg-syan-dark rounded-[2.5rem] flex items-center justify-center p-12 text-center text-white">
                    <div className="z-10">
                      <p className="text-syan-sky text-[10px] font-black uppercase tracking-[0.3em] mb-4">OG Preview Frame</p>
                      <div className="w-full max-w-sm aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center font-black text-white/20">Social Preview</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="max-w-4xl mx-auto py-10">
                   <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center space-y-12">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black text-syan-dark uppercase tracking-tight">AI Reach Forecasting</h3>
                        <p className="text-gray-400 text-sm font-medium">Predicting performance based on medical TruSEO™ analysis.</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-12">
                        {[
                          { label: 'Search Visibility', score: analyticsResult?.seoScore || 0, color: 'text-syan-teal' },
                          { label: 'Clinical Authority', score: analyticsResult?.authorityScore || 0, color: 'text-syan-sky' },
                          { label: 'User Retention', score: analyticsResult?.engagementScore || 0, color: 'text-syan-coral' }
                        ].map((m, i) => (
                          <div key={i} className="space-y-4">
                             <div className="relative w-40 h-40 mx-auto">
                                <svg className="w-full h-full transform -rotate-90">
                                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className={`${m.color} transition-all duration-1000 ease-out`} strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * m.score) / 100} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-syan-dark">{m.score}%</div>
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{m.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-10 border-t border-gray-50">
                        {analyticsResult ? (
                          <div className="bg-syan-gray p-6 rounded-2xl text-left border-l-4 border-syan-teal">
                            <p className="text-sm font-medium text-gray-600 leading-relaxed italic">"{analyticsResult.forecast}"</p>
                          </div>
                        ) : (
                          <button onClick={handlePredictAnalytics} disabled={isAiProcessing} className="px-10 py-4 bg-syan-dark text-syan-sky rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                             {isAiProcessing ? 'Simulating...' : '✨ Run Predictive Simulation'}
                          </button>
                        )}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'revisions' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {revisions.map((rev: any, i: number) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-center">
                       <div>
                          <p className="text-xs font-black text-syan-dark uppercase tracking-widest mb-1">Entry v{revisions.length - i}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(rev.changedAt).toLocaleString()}</p>
                          <p className="mt-4 text-xs font-medium text-gray-500 italic">"AI Reflection: {rev.data.aiSummary || 'No summary available'}"</p>
                       </div>
                       <button onClick={() => setBlogData(rev.data)} className="px-6 py-2 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-syan-teal hover:bg-syan-teal hover:text-white transition-all">Restore</button>
                    </div>
                  ))}
                  {revisions.length === 0 && <div className="py-20 text-center text-gray-300 font-black uppercase text-xs">No version history available.</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Registry Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-syan-gray/50 border-b border-gray-100">
              <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Insight Name</th>
              <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Registry Status</th>
              <th className="px-10 py-5 text-right text-[9px] uppercase font-black tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-syan-gray/30 transition-colors group">
                <td className="px-10 py-7">
                  <span className="font-bold text-syan-dark uppercase tracking-tight text-sm">{post.title}</span>
                </td>
                <td className="px-10 py-7">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    post.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>{post.status}</span>
                </td>
                <td className="px-10 py-7 text-right">
                  <button onClick={() => openEditor(post)} className="text-syan-sky hover:text-syan-teal font-black uppercase text-[9px] tracking-[0.2em] transition-all">Open Console</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlogs;
