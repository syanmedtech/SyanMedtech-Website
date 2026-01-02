
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOGS, BlogPost } from '../services/blogData.ts';
import { SectionLabel } from '../constants.tsx';
import SEOHead from '../components/SEOHead.tsx';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOGS.find(b => b.slug === slug);

  if (!post) {
    return <Navigate to="/blogs" />;
  }

  return (
    <div className="bg-white min-h-screen">
      <SEOHead 
        title={post.title} 
        description={post.excerpt}
        ogImage={post.coverImage}
      />

      {/* Top Breadcrumb */}
      <nav className="bg-syan-gray/50 py-6 px-6 lg:px-20 border-b border-gray-100 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto">
          <Link 
            to="/blogs" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-syan-teal hover:text-syan-coral transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Insights Registry</span>
          </Link>
        </div>
      </nav>

      {/* Header Section */}
      <header className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-[1000px] mx-auto text-center">
          <div className="flex justify-center mb-10">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              post.category === 'Technology' ? 'bg-syan-teal/10 border-syan-teal/20 text-syan-teal' :
              post.category === 'Medical' ? 'bg-syan-coral/10 border-syan-coral/20 text-syan-coral' :
              'bg-syan-yellow/10 border-syan-yellow/20 text-syan-dark'
            }`}>
              {post.category}
            </span>
          </div>
          
          <h1 className="serif text-4xl sm:text-5xl lg:text-7xl text-syan-dark mb-10 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 border-t border-b border-gray-100 py-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-syan-teal flex items-center justify-center text-white font-black text-xs shadow-lg shadow-syan-teal/20">
                {post.author.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-syan-dark">{post.author}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Medical Faculty Lead</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date Published</p>
              <p className="text-sm font-bold text-syan-dark mt-0.5">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Read Time</p>
              <p className="text-sm font-bold text-syan-teal mt-0.5">{post.readTime}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <section className="px-6 lg:px-20 mb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-[400px] lg:h-[600px] object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <article className="py-20 px-6 lg:px-20">
        <div className="max-w-[800px] mx-auto">
          <div className="space-y-12">
            {post.contentSections.map((section, idx) => {
              switch (section.type) {
                case 'heading':
                  return (
                    <h2 key={idx} className="serif text-3xl lg:text-4xl text-syan-dark border-b-4 border-syan-teal/10 pb-6 mt-16 first:mt-0">
                      {section.text}
                    </h2>
                  );
                case 'paragraph':
                  return (
                    <p key={idx} className="text-lg lg:text-xl text-gray-600 leading-[1.8] font-medium">
                      {section.text}
                    </p>
                  );
                case 'bullets':
                  return (
                    <ul key={idx} className="space-y-6 ml-4">
                      {section.items?.map((item, i) => (
                        <li key={i} className="flex items-start space-x-5 group">
                          <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-syan-coral flex-shrink-0"></div>
                          <p className="text-lg text-gray-600 font-semibold leading-relaxed group-hover:text-syan-dark transition-colors">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  );
                case 'quote':
                  return (
                    <div key={idx} className="bg-syan-gray/50 p-10 lg:p-14 rounded-[3rem] border-l-[12px] border-syan-coral shadow-sm my-16">
                      <p className="serif text-2xl lg:text-3xl text-syan-dark italic leading-relaxed">
                        "{section.text}"
                      </p>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mt-24 pt-10 border-t border-gray-100 flex flex-wrap gap-3">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-syan-gray px-4 py-2 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-24 bg-syan-dark p-12 lg:p-16 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center">
             <div className="absolute inset-0 opacity-5 medical-grid"></div>
             <div className="relative z-10">
               <SectionLabel num="Access" text="Institutional Frameworks" />
               <h3 className="serif text-3xl lg:text-4xl mb-8">Deploy this technology in your institution.</h3>
               <p className="text-gray-400 text-base font-medium mb-12 max-w-xl mx-auto">
                 Liaise with our engineering team for a technical audit of your existing infrastructure and custom module deployment.
               </p>
               <Link 
                to="/contact" 
                className="inline-block px-12 py-5 bg-syan-teal text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-white hover:text-syan-dark transition-all transform hover:-translate-y-1"
               >
                 Request Access Audit
               </Link>
             </div>
          </div>
        </div>
      </article>

      {/* Suggested / Related Section Placeholder (Logic simplified) */}
      <section className="py-24 px-6 lg:px-20 bg-syan-gray/30 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <SectionLabel num="Next" text="More from the Registry" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            {BLOGS.filter(b => b.id !== post.id).slice(0, 2).map(suggested => (
              <Link to={`/blogs/${suggested.slug}`} key={suggested.id} className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="sm:w-1/3 aspect-video sm:aspect-auto overflow-hidden">
                   <img src={suggested.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
                <div className="p-8 sm:w-2/3">
                   <span className="text-[8px] font-black uppercase tracking-widest text-syan-teal mb-2 block">{suggested.category}</span>
                   <h4 className="serif text-xl text-syan-dark group-hover:text-syan-teal transition-colors mb-2">{suggested.title}</h4>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Read Article →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
