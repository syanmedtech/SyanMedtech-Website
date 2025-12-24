import React, { useState } from 'react';
import { TeamMember } from '../types.ts';

const AdminTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { 
      id: '1', 
      name: "Dr. S. Yan", 
      role: "Principal Architect", 
      dept: "Clinical Innovation", 
      category: 'leadership', 
      bio: "Former consultant physician specializing in health informatics.", 
      photo: "https://i.pravatar.cc/150?u=Dr. S. Yan" 
    },
    { 
      id: '2', 
      name: "Ahmed Khan", 
      role: "Chief Systems Engineer", 
      dept: "Architecture", 
      category: 'tech', 
      bio: "Architect of our secure exam engine.", 
      photo: "https://i.pravatar.cc/150?u=Ahmed Khan" 
    },
    { 
      id: '3', 
      name: "Prof. Sarah Malik", 
      role: "Medical Advisor", 
      dept: "Academic Research", 
      category: 'medical', 
      bio: "Leading researcher in medical education.", 
      photo: "https://i.pravatar.cc/150?u=Prof. Sarah Malik" 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    dept: '',
    category: 'medical',
    bio: '',
    photo: '',
    linkedin: '',
  });

  const openModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        dept: member.dept,
        category: member.category,
        bio: member.bio,
        photo: member.photo,
        linkedin: member.linkedin || '',
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        dept: '',
        category: 'medical',
        bio: '',
        photo: '',
        linkedin: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...formData, id: m.id } : m));
    } else {
      const newMember: TeamMember = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setMembers(prev => [...prev, newMember]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this team member from the directory?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
      closeModal();
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-syan-dark tracking-tight">Team Members</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Add or remove staff, clinical faculty, and academic advisors.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-8 py-3.5 bg-syan-teal text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-syan-dark transition-all shadow-xl shadow-syan-teal/20 flex items-center space-x-2"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member) => (
          <div 
            key={member.id} 
            className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-2xl hover:shadow-syan-teal/5 hover:border-syan-teal/20 transition-all duration-300"
          >
            <div className="flex items-center space-x-6 min-w-0">
              <div className="w-16 h-16 bg-syan-gray rounded-full flex-shrink-0 overflow-hidden border-2 border-white shadow-inner">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-lg text-syan-dark truncate leading-none mb-1">{member.name}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{member.dept || "Unassigned Dept"}</p>
                <div className="mt-2 flex items-center">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    member.category === 'leadership' ? 'border-syan-teal text-syan-teal bg-syan-teal/5' :
                    member.category === 'medical' ? 'border-syan-sky text-syan-sky bg-syan-sky/5' :
                    'border-syan-dark text-syan-dark bg-syan-dark/5'
                  }`}>
                    {member.category}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => openModal(member)}
              className="p-3 text-gray-300 hover:text-syan-teal hover:bg-syan-teal/5 rounded-2xl transition-all flex-shrink-0"
              title="Edit Member"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* ADMIN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-syan-dark/80 backdrop-blur-md transition-opacity" onClick={closeModal}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-10 py-8 bg-syan-gray/30 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-syan-dark uppercase tracking-[0.2em]">
                  {editingMember ? 'Update Registry' : 'New Member Registration'}
                </h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-syan-teal mr-2"></span>
                  SYAN Clinical Workforce Management
                </p>
              </div>
              <button onClick={closeModal} className="p-3 text-gray-400 hover:text-syan-dark transition-colors rounded-full hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5} /></svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Legal Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-syan-gray/40 border border-gray-100 rounded-2xl focus:border-syan-teal focus:bg-white focus:ring-4 focus:ring-syan-teal/5 outline-none text-sm font-bold text-syan-dark transition-all placeholder:text-gray-300"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Dr. Salman Yan"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Professional Title</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-syan-gray/40 border border-gray-100 rounded-2xl focus:border-syan-teal focus:bg-white focus:ring-4 focus:ring-syan-teal/5 outline-none text-sm font-bold text-syan-dark transition-all placeholder:text-gray-300"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g. Principal Lead Architect"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Departmental Unit</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-syan-gray/40 border border-gray-100 rounded-2xl focus:border-syan-teal focus:bg-white focus:ring-4 focus:ring-syan-teal/5 outline-none text-sm font-bold text-syan-dark transition-all placeholder:text-gray-300"
                    value={formData.dept}
                    onChange={e => setFormData({...formData, dept: e.target.value})}
                    placeholder="e.g. Health Informatics"
                  />
                </div>
                <div className="space-y-2.5 relative">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Institutional Category</label>
                  <select 
                    className="w-full px-6 py-4 bg-syan-gray/40 border border-gray-100 rounded-2xl focus:border-syan-teal focus:bg-white focus:ring-4 focus:ring-syan-teal/5 outline-none text-sm font-bold text-syan-dark transition-all appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="leadership">Strategic Leadership</option>
                    <option value="medical">Clinical / Medical Faculty</option>
                    <option value="tech">Technology & Engineering</option>
                  </select>
                  <div className="absolute right-6 bottom-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2.5}/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Professional Abstract / Bio</label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-4 bg-syan-gray/40 border border-gray-100 rounded-2xl focus:border-syan-teal focus:bg-white focus:ring-4 focus:ring-syan-teal/5 outline-none text-sm font-medium text-syan-dark transition-all resize-none leading-relaxed placeholder:text-gray-300"
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  placeholder="Summarize the member's clinical background, key achievements, and research focus..."
                ></textarea>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Headshot URL (Image Resource)</label>
                <div className="relative">
                  <input 
                    type="url" 
                    className="w-full px-6 py-4 bg-syan-gray/40 border border-gray-100 rounded-2xl focus:border-syan-teal focus:bg-white focus:ring-4 focus:ring-syan-teal/5 outline-none text-sm font-bold text-syan-dark transition-all placeholder:text-gray-300 pl-14"
                    value={formData.photo}
                    onChange={e => setFormData({...formData, photo: e.target.value})}
                    placeholder="https://institutional-storage.com/staff/photo.jpg"
                  />
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-10 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                {editingMember ? (
                  <button 
                    type="button"
                    onClick={() => handleDelete(editingMember.id)}
                    className="group text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition-all flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2.5}/></svg>
                    <span>Remove from Registry</span>
                  </button>
                ) : <div />}
                
                <div className="flex space-x-4 w-full sm:w-auto">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 sm:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-syan-dark transition-all rounded-2xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 sm:flex-none px-12 py-4 bg-syan-teal text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-syan-teal/30 hover:bg-syan-dark transition-all"
                  >
                    {editingMember ? 'Sync Record' : 'Create Entry'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;