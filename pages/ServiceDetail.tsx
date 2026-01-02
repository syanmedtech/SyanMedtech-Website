
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SERVICES } from '../services/serviceData.ts';
import { SectionLabel } from '../constants.tsx';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find(s => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" />;
  }

  const Icon = service.icon;

  return (
    <div className="bg-white min-h-screen">
      {/* Top Breadcrumb */}
      <nav className="bg-syan-gray/50 py-6 px-6 lg:px-20 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <Link 
            to="/services" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-syan-teal hover:text-syan-coral transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Services</span>
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-4xl">
            <SectionLabel num={service.id} text="Institutional Specification" />
            <h1 className="serif text-5xl lg:text-7xl text-syan-teal mb-6 leading-[1.1] tracking-tight">
              {service.title}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-500 font-medium leading-relaxed mb-8">
              {service.subheading}
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-syan-sky bg-syan-sky/10 px-4 py-2 rounded-full border border-syan-sky/20">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Release: {service.dateTime}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-syan-coral animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Image */}
      <section className="px-6 lg:px-20 mb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl group">
            <img 
              src={service.featureImage} 
              alt={service.title} 
              className="w-full h-[400px] lg:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-syan-dark/20 to-transparent"></div>
            <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur px-8 py-8 rounded-3xl border border-white/20 shadow-xl hidden md:block">
               <Icon className="w-12 h-12 text-syan-teal mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Technical Identifier</p>
               <p className="text-xs font-mono font-bold text-syan-dark mt-1">SYM-{service.id}-v3.0</p>
            </div>
          </div>
        </div>
      </section>

      {/* Description Content */}
      <section className="py-20 px-6 lg:px-20 bg-syan-gray/30">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <h3 className="serif text-3xl text-syan-dark mb-10 border-b border-syan-teal/10 pb-6 flex items-center">
              <span className="w-8 h-8 bg-syan-yellow rounded-lg flex items-center justify-center text-syan-dark text-lg mr-4 shadow-sm">⚡</span>
              Module Architecture
            </h3>
            <ul className="space-y-8">
              {service.descriptionPoints.map((point, i) => (
                <li key={i} className="flex items-start space-x-6 group">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-syan-yellow/20 flex items-center justify-center text-syan-yellow group-hover:bg-syan-yellow group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed group-hover:text-syan-dark transition-colors">
                      {point}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-syan-dark p-10 lg:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Icon className="w-64 h-64" />
              </div>
              <SectionLabel num="PRO" text="Institutional Procurement" />
              <h4 className="serif text-3xl mb-8">Ready for Integration.</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-10 font-medium">
                Our engineering team provides end-to-end deployment support for institutional frameworks. Contact our registrar for a technical audit of your existing infrastructure.
              </p>
              <Link 
                to="/contact" 
                className="block w-full text-center py-5 bg-syan-teal text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-syan-teal/20 hover:bg-white hover:text-syan-dark transition-all transform hover:-translate-y-1"
              >
                Request Technical Access
              </Link>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Clinical Grade</span>
                <span className="text-syan-sky">HIPAA/GDPR READY</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
