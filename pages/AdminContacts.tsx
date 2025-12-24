
import React from 'react';

const AdminContacts: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-syan-dark">Inquiries & Leads</h1>
        <p className="text-sm text-gray-500">Track and respond to incoming requests</p>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
              <div>
                <h4 className="font-bold text-syan-dark">Lead Name {i}</h4>
                <p className="text-xs text-gray-400">lead@email.com • {i} hours ago</p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Service:</span>
              <span className="ml-2 text-xs font-medium">SYAN Exams</span>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-xs font-bold text-syan-teal hover:bg-syan-teal/5 rounded-lg transition-colors">View Message</button>
              <button className="px-4 py-2 text-xs font-bold bg-syan-teal text-white rounded-lg">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContacts;
