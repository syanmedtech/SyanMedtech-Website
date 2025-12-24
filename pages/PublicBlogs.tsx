
import React, { useState, useEffect } from 'react';
import { SectionLabel } from '../constants.tsx';
import SEOHead from '../components/SEOHead.tsx';
import { db } from '../services/firestore.ts';

const PublicBlogs: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await db.list('blogs');
      setPosts(data.length ? data : [
        {
          id: '1',
          title: 'The Future of AI in Clinical Diagnosis',
          excerpt: 'Exploring how generative models are reshaping the speed and accuracy of medical assessments in primary care.',
          author: 'Dr. S. Yan',
          date: 'Oct 24, 2024',
          category: 'AI Technology',
          readTime: '6 min',
          seo: { metaDescription: 'A technical look at generative AI in healthcare.' }
        }
      ]);
    };
    load();
  }, []);

  return (
    <div className="bg-syan-gray min-h-screen">
      <SEOHead 
        title="Medical Insights & Research Registry" 
        description="Technical papers and strategic updates from the SYAN MED technology ecosystem. Indexed for clinical professionals."
      />
      
      {/* Hero */}
      <section className="bg-white py-16 px-6 lg:px-20 border-b border-syan-sky/10">
        <div className="max-w-[1400px] mx-auto">
          <SectionLabel num="Resource Library" text="Medical Insights & Research" />
          <h1 className="serif text-5xl lg:text-6xl text-syan-dark mb-6 max-w-2xl leading-tight">
            Knowledge for the <span className="text-syan-teal italic">Clinical Era</span>.
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed">
            Technical papers, case studies, and strategic updates from the SYAN MED technology ecosystem.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm group hover:shadow-xl hover:border-syan-teal/30 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-syan-teal/5 text-syan-teal text-[9px] font-black uppercase tracking-widest rounded-full border border-syan-teal/10">
                  {post.category || 'Clinical Insight'}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {post.readTime || '5 min'} Read
                </span>
              </div>

              <h2 className="serif text-2xl text-syan-dark mb-4 group-hover:text-syan-teal transition-colors">
                {post.title}
              </h2>
              
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-grow line-clamp-3">
                {post.excerpt || post.content?.substring(0, 150)}
              </p>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-syan-dark">{post.author}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">{post.date}</p>
                </div>
                <button className="text-syan-sky hover:text-syan-teal transition-colors flex items-center group/btn">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Paper</span>
                  <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PublicBlogs;
