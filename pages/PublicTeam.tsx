
import React from 'react';
import { SectionLabel } from '../constants';

const PublicTeam: React.FC = () => {
  const faculty = [
    { name: "Dr. S. Yan", role: "Principal Architect", dept: "Clinical Innovation", bio: "Former consultant physician specializing in health informatics and digital strategy." },
    { name: "Ahmed Khan", role: "Chief Systems Engineer", dept: "Architecture", bio: "Architect of our secure exam engine and data integrity protocols." },
    { name: "Prof. Sarah Malik", role: "Medical Advisor", dept: "Academic Research", bio: "Leading researcher in medical education pedagogy and student evaluation." },
    { name: "Bilal Raza", role: "Lead Developer", dept: "AI & ML", bio: "Expert in LLM fine-tuning for specialized medical diagnostic datasets." },
    { name: "Zainab Ali", role: "Director of Outreach", dept: "Community Support", bio: "Oversees our scholarship programs and volunteer clinical initiatives." },
    { name: "Dr. Hassan", role: "Content Strategist", dept: "LMS Content", bio: "Curates high-yield clinical content for the Medical Globe platform." }
  ];

  return (
    <div className="bg-white min-h-screen py-32 px-6 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-32">
            <SectionLabel num="Faculty" text="The Research Team" />
            <h1 className="serif text-7xl text-syan-dark mb-12">The Intellectual <br /> Capital.</h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Our team is a unique hybrid of medical practitioners and technology pioneers. We don't just build code; we research clinical impact.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-24 gap-y-20">
          {faculty.map((member, idx) => (
            <div key={idx} className="flex space-x-12 border-b border-gray-100 pb-16 group hover:border-syan-teal transition-colors duration-500">
               <div className="w-24 h-24 bg-gray-100 rounded-sm grayscale group-hover:grayscale-0 transition-all flex-shrink-0 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} className="w-full h-full object-cover" />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-syan-dark mb-1">{member.name}</h3>
                  <p className="text-[10px] font-black uppercase text-syan-teal tracking-widest mb-4">
                    {member.role} // <span className="text-gray-300">{member.dept}</span>
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md italic">"{member.bio}"</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicTeam;
