import React, { useState } from 'react';
import { SectionLabel } from '../constants';

const PublicContact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'Institutional Access', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => { setStatus('success'); }, 1500);
  };

  return (
    <div className="bg-syan-gray min-h-screen">
      <section className="py-14 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Info Side */}
            <div className="lg:col-span-5">
              <SectionLabel num="Inquiry" text="Collaboration Portal" />
              <h1 className="serif text-4xl lg:text-5xl text-syan-dark mb-6 leading-tight">Submit Your <br /> Prospectus.</h1>
              <p className="text-gray-500 text-base font-medium leading-relaxed mb-10">
                Liaise with our team regarding institutional access or digital medical transition support.
              </p>

              <div className="space-y-6">
                {[
                  { label: "Academic Liaison", value: "collaboration@syanmed.tech", color: "syan-teal" },
                  { label: "Technical Support", value: "support@syanmed.tech", color: "syan-sky" },
                  { label: "Regional HQ", value: "Medical Research Complex, Wing B", color: "syan-dark" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">{item.label}</p>
                    <p className={`text-sm font-bold text-${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-7 bg-white p-10 rounded-xl border border-gray-100 shadow-xl">
              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-syan-teal/10 text-syan-teal rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="serif text-2xl text-syan-dark mb-2">Submission Received.</h3>
                  <p className="text-gray-500 mb-8 text-sm">Indexed. Our registrar will respond within 48 business hours.</p>
                  <button onClick={() => setStatus('idle')} className="text-[10px] font-black uppercase tracking-widest text-syan-teal border-b-2 border-syan-teal">Resubmit Form</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Applicant Name</label>
                      <input required type="text" className="w-full bg-syan-gray border border-gray-100 px-4 py-2.5 rounded-md focus:border-syan-teal outline-none transition-all text-sm font-bold text-syan-dark" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Official Email</label>
                      <input required type="email" className="w-full bg-syan-gray border border-gray-100 px-4 py-2.5 rounded-md focus:border-syan-teal outline-none transition-all text-sm font-bold text-syan-dark" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Requested Module</label>
                    <select className="w-full bg-syan-gray border border-gray-100 px-4 py-2.5 rounded-md focus:border-syan-teal outline-none transition-all text-sm font-bold text-syan-dark appearance-none" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                      <option>Institutional Access</option>
                      <option>Exam Architecture</option>
                      <option>LMS Deployment</option>
                      <option>AI Diagnostic Pilot</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Context / Proposal</label>
                    <textarea rows={3} className="w-full bg-syan-gray border border-gray-100 px-4 py-2.5 rounded-md focus:border-syan-teal outline-none transition-all text-sm font-bold text-syan-dark" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                  <button disabled={status === 'sending'} className="w-full py-4 bg-syan-teal text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-syan-teal/10 hover:bg-syan-dark transition-all disabled:opacity-50 rounded-md">
                    {status === 'sending' ? 'Transmitting...' : 'Send Prospectus'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicContact;