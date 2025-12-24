
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/firestore.ts';
import { seoService } from '../services/seo.ts';
import { ICONS } from '../constants.tsx';
import { RichTextEditor } from '../components/RichTextEditor.tsx';

type Tab = 'content' | 'media' | 'seo' | 'metadata' | 'analytics' | 'revisions';

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

const DEFAULT_BLOG_DATA = {
  title: '', 
  author: 'Dr. S. Yan', 
  content: '', 
  status: 'Draft',
  slug: '',
  publishDate: new Date().toISOString().split('T')[0],
  template: 'Standard',
  allowComments: true,
  tags: '',
  media: [] as { type: 'image' | 'video', url: string, alt?: string }[],
  seo: { 
    focusKeyword: '', 
    seoTitle: '', 
    metaDescription: '', 
    canonicalUrl: '', 
    noIndex: false 
  },
  social: { ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image' },
  schema: { type: 'MedicalEntity', data: '{}' }
};

const AdminBlogs: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
  // Editor State
  const [blogData, setBlogData] = useState(DEFAULT_BLOG_DATA);

  const [seoAnalysis, setSeoAnalysis] = useState<{score: number, checks: string[]}>({ score: 0, checks: [] });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (editingId) {
      loadRevisions(editingId);
    }
  }, [editingId]);

  const loadPosts = async () => {
    const data = await db.list('blogs');
    setPosts(data.length ? data : [
      { id: '1', title: 'The Future of AI in Clinical Diagnosis', author: 'Dr. S. Yan', status: 'Published', date: '2024-10-24', slug: 'ai-clinical-diagnosis', seo: { focusKeyword: 'Clinical AI', metaDescription: 'Expert insights into clinical AI.' } }
    ]);
  };

  const loadRevisions = async (id: string) => {
    const revs = await db.get('seo_revisions', id);
    setRevisions(revs || []);
  };

  const handleTitleChange = (val: string) => {
    const slug = (val || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newData = { ...blogData, title: val, slug };
    setBlogData(newData);
    handleLiveSEO(newData);
  };

  const handleLiveSEO = (data = blogData) => {
    const result = seoService.calculateScore(data.content, data.title, data.seo?.focusKeyword || '');
    setSeoAnalysis(result);
  };

  const handleAiGenerate = async () => {
    if (!blogData.title || !blogData.seo?.focusKeyword) {
      alert("Please enter a Title and Focus Keyword first for the AI to follow SEO rules.");
      return;
    }
    setIsAiGenerating(true);
    const content = await seoService.generateSEOContent(blogData.title, blogData.seo.focusKeyword);
    if (content) {
      const newData = { ...blogData, content };
      setBlogData(newData);
      handleLiveSEO(newData);
    } else {
      alert("AI Generation failed. Check API Key or connectivity.");
    }
    setIsAiGenerating(false);
  };

  const saveBlog = async () => {
    const id = editingId || Math.random().toString(36).substr(2, 9);
    await db.save('blogs', id, { ...blogData, id });
    await loadPosts();
    setIsAdding(false);
  };

  const addMedia = (type: 'image' | 'video') => {
    const url = prompt(`Enter ${type} URL:`);
    if (url) {
      setBlogData({
        ...blogData,
        media: [...(blogData.media || []), { type, url, alt: '' }]
      });
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = [...(blogData.media || [])];
    newMedia.splice(index, 1);
    setBlogData({ ...blogData, media: newMedia });
  };

  const openEditor = (post: any = null) => {
    if (post) {
      setEditingId(post.id);
      // Deep merge with defaults to ensure nested objects exist
      setBlogData({
        ...DEFAULT_BLOG_DATA,
        ...post,
        seo: { ...DEFAULT_BLOG_DATA.seo, ...(post.seo || {}) },
        social: { ...DEFAULT_BLOG_DATA.social, ...(post.social || {}) },
        media: post.media || []
      });
    } else {
      setEditingId(null);
      setBlogData(DEFAULT_BLOG_DATA);
    }
    setActiveTab('content');
    setIsAdding(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-syan-dark tracking-tight uppercase">Insight Registry</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Enterprise CMS with TruSEO™ & AI Generation.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="px-8 py-3.5 bg-syan-teal text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-syan-teal/20 hover:scale-105 transition-transform"
        >
          <span>+ Compose Insight</span>
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-syan-dark/90 backdrop-blur-md" onClick={() => setIsAdding(false)}></div>
          <div className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-8">
            
            {/* Tab Header */}
            <div className="px-10 pt-8 border-b border-gray-100 bg-syan-gray/20">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-black text-syan-dark uppercase tracking-widest">Medical Insight Editor</h2>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${blogData.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {blogData.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${seoAnalysis.score > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    <span className="text-[10px] font-black uppercase">SEO Score: {seoAnalysis.score}/100</span>
                  </div>
                  <button onClick={saveBlog} className="px-8 py-2.5 bg-syan-teal text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-syan-dark transition-colors">
                    {editingId ? 'Update Insight' : 'Publish to Registry'}
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                {(['content', 'media', 'seo', 'metadata', 'analytics', 'revisions'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                      activeTab === tab ? 'border-syan-teal text-syan-teal' : 'border-transparent text-gray-400 hover:text-syan-dark'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-10 bg-white medical-grid">
              {activeTab === 'content' && (
                <div className="space-y-8 max-w-5xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Article Title</label>
                      <input 
                        type="text" 
                        value={blogData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-6 py-5 bg-syan-gray/50 border border-gray-100 rounded-2xl mt-2 font-bold text-lg serif outline-none focus:border-syan-teal transition-all" 
                        placeholder="e.g. Advancements in Pediatric Genomic Sequencing"
                      />
                    </div>
                    <div className="md:w-64 pt-6">
                       <button 
                        onClick={handleAiGenerate}
                        disabled={isAiGenerating}
                        className="w-full h-16 flex items-center justify-center space-x-2 bg-syan-dark text-syan-sky rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                       >
                         {isAiGenerating ? (
                           <span className="animate-pulse">Synthesizing...</span>
                         ) : (
                           <>
                             <span>✨ AI SEO Generate</span>
                           </>
                         )}
                       </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Permanent URL Slug</label>
                      <div className="flex items-center mt-2 bg-syan-gray/50 border border-gray-100 rounded-2xl px-6 py-4">
                        <span className="text-[10px] text-gray-400 font-bold">.../blogs/</span>
                        <input 
                          type="text" 
                          value={blogData.slug}
                          onChange={(e) => setBlogData({...blogData, slug: e.target.value})}
                          className="flex-grow bg-transparent outline-none text-xs font-bold text-syan-teal ml-1" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Faculty Author</label>
                      <select 
                        value={blogData.author}
                        onChange={(e) => setBlogData({...blogData, author: e.target.value})}
                        className="w-full px-6 py-4 bg-syan-gray/50 border border-gray-100 rounded-2xl mt-2 font-bold appearance-none outline-none focus:border-syan-teal"
                      >
                        <option>Dr. S. Yan</option>
                        <option>Prof. Sarah Malik</option>
                        <option>Ahmed Khan</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-[500px] flex flex-col">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Content Material & Insights</label>
                    <RichTextEditor 
                      value={blogData.content}
                      onChange={(val) => {
                        const newData = { ...blogData, content: val };
                        setBlogData(newData);
                        handleLiveSEO(newData);
                      }}
                      placeholder="Draft clinical content..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-8">
                  <div className="flex space-x-4">
                    <button onClick={() => addMedia('image')} className="flex items-center space-x-2 px-6 py-3 bg-syan-gray rounded-xl border border-gray-100 hover:border-syan-teal transition-all">
                      <span className="text-xl">🖼️</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Add Image URL</span>
                    </button>
                    <button onClick={() => addMedia('video')} className="flex items-center space-x-2 px-6 py-3 bg-syan-gray rounded-xl border border-gray-100 hover:border-syan-teal transition-all">
                      <span className="text-xl">🎥</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Add Video URL</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(blogData.media || []).map((m, i) => (
                      <div key={i} className="relative bg-white p-4 rounded-3xl border border-gray-100 group shadow-sm">
                        <button 
                          onClick={() => removeMedia(i)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >✕</button>
                        <div className="aspect-video bg-syan-gray rounded-2xl overflow-hidden mb-4">
                          {m.type === 'image' ? (
                            <img src={m.url} className="w-full h-full object-cover" alt="preview" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-syan-sky font-black text-[10px]">VIDEO ASSET</div>
                          )}
                        </div>
                        <p className="text-[9px] font-black text-gray-400 truncate">{m.url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Search Engine Result Preview (SERP)</h4>
                      <SERPPreview 
                        title={blogData.seo?.seoTitle || blogData.title} 
                        url={blogData.slug} 
                        description={blogData.seo?.metaDescription || ''} 
                      />
                    </div>

                    <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Focus Keyword</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Clinical AI"
                          value={blogData.seo?.focusKeyword || ''}
                          onChange={(e) => { 
                            const newData = {...blogData, seo: {...(blogData.seo || {}), focusKeyword: e.target.value}};
                            setBlogData(newData); 
                            handleLiveSEO(newData); 
                          }}
                          className="w-full px-6 py-4 bg-syan-gray border border-gray-100 rounded-2xl mt-2 font-bold outline-none focus:border-syan-teal" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">SEO Title Override</label>
                        <input 
                          type="text" 
                          value={blogData.seo?.seoTitle || ''}
                          onChange={(e) => setBlogData({...blogData, seo: {...(blogData.seo || {}), seoTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-syan-gray border border-gray-100 rounded-2xl mt-2 font-bold outline-none focus:border-syan-teal" 
                        />
                        <p className="text-[9px] text-gray-400 mt-2 ml-1 uppercase font-bold">Chars: {(blogData.seo?.seoTitle?.length || blogData.title?.length || 0)} / 60</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Meta Description</label>
                        <textarea 
                          rows={3} 
                          value={blogData.seo?.metaDescription || ''}
                          onChange={(e) => setBlogData({...blogData, seo: {...(blogData.seo || {}), metaDescription: e.target.value}})}
                          className="w-full px-6 py-4 bg-syan-gray border border-gray-100 rounded-2xl mt-2 font-medium outline-none focus:border-syan-teal resize-none"
                          placeholder="Summarize the insight for search engines..."
                        ></textarea>
                        <p className="text-[9px] text-gray-400 mt-2 ml-1 uppercase font-bold">Chars: {(blogData.seo?.metaDescription?.length || 0)} / 160</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-syan-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ICONS.AI className="w-32 h-32" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-syan-sky mb-6 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-syan-sky animate-pulse mr-2"></span>
                        Live SEO Analysis
                      </h4>
                      <ul className="space-y-4">
                        {(seoAnalysis.checks || []).map((check, i) => (
                          <li key={i} className="flex items-start text-[11px] font-bold text-gray-300">
                            <span className={`mr-3 text-lg leading-none ${check.includes("optimal") || check.includes("detected") || check.includes("Excellent") || check.includes("Focus keyword") || check.includes("Ideal") ? 'text-syan-sky' : 'text-syan-coral'}`}>•</span> 
                            <span>{check}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end">
                          <span className="text-[9px] uppercase font-black tracking-widest text-gray-500">Clinical Optimization</span>
                          <span className="text-3xl font-black text-syan-sky">{seoAnalysis.score}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
                  <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Publish Date</label>
                      <input 
                        type="date" 
                        value={blogData.publishDate}
                        onChange={(e) => setBlogData({...blogData, publishDate: e.target.value})}
                        className="w-full px-6 py-4 bg-syan-gray/50 border border-gray-100 rounded-2xl mt-2 font-bold outline-none focus:border-syan-teal" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Post Status</label>
                      <select 
                        value={blogData.status}
                        onChange={(e) => setBlogData({...blogData, status: e.target.value as any})}
                        className="w-full px-6 py-4 bg-syan-gray/50 border border-gray-100 rounded-2xl mt-2 font-bold outline-none"
                      >
                        <option>Draft</option>
                        <option>Published</option>
                        <option>Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Layout Template</label>
                      <select 
                        value={blogData.template}
                        onChange={(e) => setBlogData({...blogData, template: e.target.value})}
                        className="w-full px-6 py-4 bg-syan-gray/50 border border-gray-100 rounded-2xl mt-2 font-bold outline-none"
                      >
                        <option>Standard</option>
                        <option>Clinical Study</option>
                        <option>Technical Report</option>
                        <option>Academic Paper</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tags (Comma Separated)</label>
                      <input 
                        type="text" 
                        placeholder="AI, Diagnostics, Pedagogy"
                        value={blogData.tags}
                        onChange={(e) => setBlogData({...blogData, tags: e.target.value})}
                        className="w-full px-6 py-4 bg-syan-gray/50 border border-gray-100 rounded-2xl mt-2 font-bold outline-none focus:border-syan-teal" 
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-syan-gray/30 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-[10px] font-black uppercase text-syan-dark tracking-widest">Discussion Panel</p>
                        <p className="text-[9px] text-gray-400 font-bold">Allow institutional comments</p>
                      </div>
                      <button 
                        onClick={() => setBlogData({...blogData, allowComments: !blogData.allowComments})}
                        className={`w-12 h-6 rounded-full transition-all relative ${blogData.allowComments ? 'bg-syan-teal' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${blogData.allowComments ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'revisions' && (
                <div className="space-y-4 max-w-3xl">
                  {revisions.length > 0 ? revisions.map((rev, i) => (
                    <div key={rev.revId} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-syan-teal transition-all group">
                      <div className="flex items-center space-x-6">
                        <div className="w-10 h-10 bg-syan-gray rounded-full flex items-center justify-center text-gray-400 font-black text-xs">#{revisions.length - i}</div>
                        <div>
                          <p className="text-sm font-bold text-syan-dark">Modified by {rev.data.author || 'System'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(rev.changedAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm('Restore this revision? Unsaved changes will be lost.')) {
                            setBlogData(rev.data);
                            setActiveTab('content');
                          }
                        }}
                        className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-syan-sky hover:text-syan-teal group-hover:scale-105 transition-transform"
                      >Restore Record</button>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-syan-gray/30 rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                      No previous revisions found for this insight.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Registry Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-syan-gray/50 border-b border-gray-100">
              <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Article Registry Entry</th>
              <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Permanent Slug</th>
              <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Clinical Review Status</th>
              <th className="px-10 py-5 text-right text-[9px] uppercase font-black tracking-widest text-gray-400">System Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-syan-gray/30 transition-colors group">
                <td className="px-10 py-7">
                  <div className="flex flex-col">
                    <span className="font-bold text-syan-dark uppercase tracking-tight text-sm mb-0.5">{post.title}</span>
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">By {post.author}</span>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <span className="text-syan-teal font-mono bg-syan-teal/5 px-3 py-1 rounded-md text-[10px]">/{post.slug}</span>
                </td>
                <td className="px-10 py-7">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    post.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-10 py-7 text-right space-x-6">
                  <button 
                    onClick={() => openEditor(post)} 
                    className="text-syan-sky hover:text-syan-teal font-black uppercase text-[9px] tracking-[0.2em] transition-all"
                  >Enter Editor</button>
                  <button className="text-red-300 hover:text-red-500 font-black uppercase text-[9px] tracking-[0.2em] transition-all">Archive</button>
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
