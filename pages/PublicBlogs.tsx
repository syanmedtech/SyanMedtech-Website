
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../constants.tsx';
import SEOHead from '../components/SEOHead.tsx';
import { BLOGS, BlogPost } from '../services/blogData.ts';

const PublicBlogs: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Technology' | 'Medical' | 'Education'>('All');

  const filteredPosts = filter === 'All' 
    ? BLOGS 
    : BLOGS.filter(post => post.category === filter);

  const categories = ['All', 'Technology', 'Medical', 'Education'] as const;

  return (
    <div className="bg-syan-gray min-h-screen">
      <SEOHead 
        title="Medical Insights & Research Registry" 
        description="Technical papers and strategic updates from the SYAN MED technology ecosystem. Indexed for clinical professionals."
      />
      
      {/* Hero Header */}
      <section className="bg-white py-20 px-6 lg:px-20 border-b border-syan-sky/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none medical-grid"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionLabel num="Registry" text="Clinical Insights & Research" />
          <h1 className="serif text-5xl lg:text-7xl text-syan-dark mb-8 leading-[1.1] tracking-tight">
            Advancing the <span className="text-syan-teal">Medical</span> <span className="text-[#2C7B71] italic">Dialogue</span>.
          </h1>
          <p className="text-gray-500 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
            Technical whitepapers, pedagogical breakthroughs, and updates from the frontline of medical software engineering.
          </p>
        </div>
      </section>

      {/* Filter Row */}
      <section className="py-12 px-6 lg:px-20 bg-white/50 backdrop-blur-sm border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-[1400px] mx-auto flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat
                  ? 'bg-syan-teal text-white shadow-lg shadow-syan-teal/20'
                  : 'bg-white text-gray-400 hover:text-syan-teal border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post) => (
            <Link 
              to={`/blogs/${post.slug}`} 
              key={post.id}
              className="group block outline-none"
            >
              <article 
                className={`h-full bg-white rounded-[2.5rem] border border-gray-100 p-4 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:border-syan-coral transition-all duration-500 flex flex-col relative overflow-hidden ${
                  post.category === 'Technology' ? 'bg-syan-teal/[0.02]' : 'bg-syan-yellow/[0.02]'
                }`}
              >
                {/* Image Wrap */}
                <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 relative">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${
                      post.category === 'Technology' ? 'bg-syan-teal/10 border-syan-teal/20 text-syan-teal' :
                      post.category === 'Medical' ? 'bg-syan-coral/10 border-syan-coral/20 text-syan-coral' :
                      'bg-syan-yellow/10 border-syan-yellow/20 text-syan-dark'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 flex-grow flex flex-col">
                  <h2 className="serif text-2xl text-syan-dark mb-4 group-hover:text-syan-teal transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-grow line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="pt-6 border-t border-gray-100/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-syan-gray border border-gray-100 flex items-center justify-center text-[10px] font-black text-syan-teal">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-syan-dark">{post.author}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest group-hover:text-syan-teal transition-colors">
                      {post.readTime}
                    </span>
                  </div>
                </div>
                
                {/* Focus indicator ring for accessibility */}
                <div className="absolute inset-0 ring-inset ring-syan-teal opacity-0 group-focus:ring-2 group-focus:opacity-100 pointer-events-none rounded-[2.5rem]"></div>
              </article>
            </Link>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border border-gray-100">
               <p className="text-gray-300 font-black uppercase tracking-widest">No articles found in this registry category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-24 px-6 lg:px-20 bg-syan-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 medical-grid"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionLabel num="Newsletter" text="Registry Digest" />
          <h2 className="serif text-4xl lg:text-6xl mb-12">Clinical Intelligence, <br /> Delivered Bi-Weekly.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
             <input 
              type="email" 
              placeholder="Institutional Email" 
              className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl flex-grow outline-none focus:border-syan-sky transition-all text-sm" 
             />
             <button className="px-10 py-4 bg-syan-teal text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-syan-dark transition-all">
                Subscribe
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicBlogs;
