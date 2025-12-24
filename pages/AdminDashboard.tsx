import React from 'react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { name: 'Active Modules', value: '08', icon: '⚡', trend: 'Systems OK' },
    { name: 'Medical Faculty', value: '12', icon: '🩺', trend: 'Full Staff' },
    { name: 'Open Inquiries', value: '45', icon: '📩', trend: 'Critical: 03' },
    { name: 'API Volume', value: '12k', icon: '🤖', trend: 'Gemini 3 Pro' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-syan-dark">Clinical Command Center</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-0.5">SYAN MED Tech Admin Dashboard</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-100 rounded-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">System Status: Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 group hover:border-syan-teal transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl p-2 bg-syan-gray rounded-lg">{stat.icon}</span>
              <span className="text-[9px] font-black text-syan-teal tracking-widest">{stat.trend}</span>
            </div>
            <h3 className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-0.5">{stat.name}</h3>
            <p className="text-2xl font-black text-syan-dark tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-syan-dark">Recent Inquiries</h3>
            <button className="text-[9px] font-bold text-syan-sky uppercase hover:underline">View All Archive</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-syan-gray/50 border-b border-gray-50">
                <tr className="text-left text-gray-400 text-[9px] uppercase font-black tracking-widest">
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50">
                {[
                  { name: 'Dr. Ahmad Khan', service: 'SYAN Exams', date: '2h ago', status: 'New' },
                  { name: 'Fatima Z.', service: 'LMS Platform', date: '5h ago', status: 'Viewed' },
                  { name: 'City Hospital', service: 'EMR Dashboard', date: '1d ago', status: 'Replied' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-syan-gray/30 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-syan-dark">{row.name}</td>
                    <td className="px-6 py-3.5 text-gray-500 font-medium">{row.service}</td>
                    <td className="px-6 py-3.5 text-gray-400 font-medium">{row.date}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        row.status === 'New' ? 'bg-blue-100 text-blue-600' : 
                        row.status === 'Viewed' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-syan-dark mb-6">Resource Allocation</h3>
          <div className="space-y-6">
            {[
              { label: "Clinical Database", value: "24%", color: "bg-syan-teal" },
              { label: "Media Server", value: "68%", color: "bg-syan-sky" },
              { label: "AI Tokens (Gemini)", value: "35%", color: "bg-syan-dark" }
            ].map((res, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-1.5">
                  <span className="text-gray-400">{res.label}</span>
                  <span className="text-syan-dark">{res.value}</span>
                </div>
                <div className="w-full bg-syan-gray h-1.5 rounded-full overflow-hidden border border-gray-100">
                  <div className={`${res.color} h-full rounded-full transition-all duration-1000`} style={{ width: res.value }}></div>
                </div>
              </div>
            ))}
            <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-[9px] text-gray-400 uppercase font-bold italic leading-relaxed">
                * Backup synchronized automatically to encrypted clinical nodes at 04:00 GMT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;