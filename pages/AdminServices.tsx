
import React, { useState } from 'react';

const AdminServices: React.FC = () => {
  const [services, setServices] = useState([
    { id: 1, title: 'SYAN Exams', status: 'Active', featured: true },
    { id: 2, title: 'Medical Globe', status: 'Active', featured: true },
    { id: 3, title: 'DiagnoseRight', status: 'Active', featured: true },
    { id: 4, title: 'EMR Dashboards', status: 'Draft', featured: false },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-syan-dark">Services Manager</h1>
          <p className="text-sm text-gray-500">Manage your product and service catalog</p>
        </div>
        <button className="px-6 py-2.5 bg-syan-teal text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md">
          + Add New Service
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase tracking-wider bg-gray-50/50">
              <th className="px-6 py-4 font-medium">Service Name</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Featured</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-syan-dark">{service.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    service.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`w-10 h-5 rounded-full p-1 transition-colors ${service.featured ? 'bg-syan-teal' : 'bg-gray-200'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${service.featured ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button className="text-syan-sky hover:underline text-sm font-bold">Edit</button>
                  <button className="text-red-400 hover:text-red-600 text-sm font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-6 bg-syan-yellow/10 rounded-2xl border border-syan-yellow/20 flex items-start space-x-4">
        <span className="text-2xl">💡</span>
        <div>
          <p className="text-sm font-bold text-syan-dark">CMS Tip</p>
          <p className="text-xs text-gray-600 mt-1">Changes made here reflect immediately on the "Our Services" public page. Drag and drop rows to reorder how they appear.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
