
import React from 'react';

const AdminTeam: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-syan-dark">Team Members</h1>
          <p className="text-sm text-gray-500">Add or remove staff and advisors</p>
        </div>
        <button className="px-6 py-2.5 bg-syan-teal text-white rounded-xl font-bold">
          + Add Team Member
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <h4 className="font-bold text-syan-dark">Team Member {i}</h4>
              <p className="text-xs text-gray-400">Department Name</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-syan-teal">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2} /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeam;
