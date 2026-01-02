
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../constants.tsx';
import { SERVICES } from '../services/serviceData.ts';

const PublicServices: React.FC = () => {
  return (
    <div className="bg-syan-gray min-h-screen">
      <section className="bg-white py-20 px-6 lg:px-20 border-b border-syan-sky/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
              <SectionLabel num="Services" text="Capability Portfolio" />
              <h1 className="serif text-5xl lg:text-7xl text-syan-dark mb-6 leading-tight">
                Clinical Grade <span className="text-syan-teal">Modules</span>.
              </h1>
              <p className="text-gray-500 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
                We provide specialized medical-tech architecture designed for deep institutional integration and clinical excellence.
              </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          {SERVICES.map((module, idx) => {
            const Icon = module.icon;
            return (
              <Link 
                to={`/services/${module.slug}`}
                key={idx} 
                className="block outline-none group"
              >
                <div 
                  className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-syan-teal/10 shadow-sm grid lg:grid-cols-12 gap-10 items-center transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-[0_40px_80px_rgba(44,123,113,0.12)] group-hover:border-syan-coral focus:ring-4 focus:ring-syan-teal/20"
                >
                  <div className="lg:col-span-1 hidden lg:block">
                    <span className="serif text-7xl text-gray-100 group-hover:text-syan-teal/20 transition-colors duration-500">{module.id}</span>
                  </div>
                  <div className="lg:col-span-4">
                    <h2 className="text-2xl lg:text-3xl font-black text-syan-teal mb-4 tracking-tight group-hover:text-syan-coral transition-colors duration-300">{module.title}</h2>
                    <div className="w-14 h-14 bg-syan-teal/5 rounded-2xl flex items-center justify-center text-syan-teal group-hover:bg-syan-yellow/30 group-hover:text-syan-coral transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="lg:col-span-7 grid md:grid-cols-2 gap-8 lg:border-l lg:border-gray-50 lg:pl-12">
                    <div className="space-y-6">
                      <div>
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1.5">Module Solution</p>
                          <p className="text-sm text-syan-dark font-bold leading-relaxed">{module.solution}</p>
                      </div>
                      <div className="bg-syan-teal/[0.03] p-6 rounded-2xl border border-syan-teal/5 group-hover:border-syan-coral/20 transition-colors">
                          <p className="text-[10px] uppercase font-black text-syan-coral tracking-widest mb-2">Strategic Impact</p>
                          <p className="text-xs text-gray-500 italic font-medium">"{module.impact}"</p>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col justify-end items-end">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-syan-teal group-hover:translate-x-2 transition-transform">
                         View Specifications →
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PublicServices;
