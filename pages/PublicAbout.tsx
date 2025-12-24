import React from 'react';
import { SectionLabel } from '../constants';

const PublicAbout: React.FC = () => {
  const milestones = [
    { year: "2021", title: "Education Seed", desc: "Solving high-stakes medical exam proctoring challenges." },
    { year: "2022", title: "LMS Deployment", desc: "Release of modular LMS for 10,000+ medical students." },
    { year: "2023", title: "Clinic Logic", desc: "Expanding into EMR-style workflows for regional healthcare." },
    { year: "2024", title: "AI Diagnostic", desc: "Integration of DiagnoseRight simulation tools." }
  ];

  return (
    <div className="bg-syan-gray min-h-screen">
      <section className="bg-white py-14 px-6 lg:px-20 border-b border-syan-sky/10">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <SectionLabel num="Philosophy" text="Mission & Vision" />
                <h1 className="serif text-4xl lg:text-5xl text-syan-dark mb-6 leading-tight">Built by Clinicians, <br /> For Medicine.</h1>
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  Generic software often fails in the medical domain. We build platforms that speak the language of doctors and educators natively.
                </p>
                <div className="grid grid-cols-2 gap-6">
                    <div className="border-l-4 border-syan-teal pl-4 py-1">
                        <p className="text-[9px] font-black uppercase text-syan-teal tracking-widest mb-1">Our Vision</p>
                        <p className="text-[11px] font-bold text-syan-dark uppercase">Global medical excellence.</p>
                    </div>
                    <div className="border-l-4 border-syan-sky pl-4 py-1">
                        <p className="text-[9px] font-black uppercase text-syan-sky tracking-widest mb-1">Our Values</p>
                        <p className="text-[11px] font-bold text-syan-dark uppercase">Integrity & Innovation.</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <div className="relative w-full max-w-lg aspect-square overflow-hidden rounded-xl border border-gray-100 shadow-xl">
                  <img src="https://picsum.photos/id/447/800/800" alt="Med Tech" className="w-full h-full object-cover grayscale opacity-80" />
                  <div className="absolute inset-0 bg-syan-teal/10 pointer-events-none"></div>
                </div>
            </div>
        </div>
      </section>

      <section className="py-14 px-6 lg:px-20 bg-syan-teal/[0.03]">
        <div className="max-w-[1400px] mx-auto">
          <SectionLabel num="History" text="The Evolution" />
          <div className="relative grid md:grid-cols-4 gap-6 mt-8">
              {milestones.map((m, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
                      <span className="serif text-2xl text-syan-sky mb-4 block">{m.year}</span>
                      <div className="h-1 w-8 bg-syan-teal mb-6 group-hover:w-full transition-all duration-500"></div>
                      <h4 className="font-bold text-sm text-syan-dark mb-2 uppercase tracking-wide">{m.title}</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{m.desc}</p>
                  </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicAbout;