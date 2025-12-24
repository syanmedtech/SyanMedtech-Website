
import React from 'react';

const AdminSettings: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-syan-dark">Global Settings</h1>
        <p className="text-sm text-gray-500">Manage site-wide branding, SEO, and contact details</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">General Branding</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
              <input type="text" defaultValue="SYAN MED Tech" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
              <input type="text" defaultValue="Pioneering Medical Tech" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Logo</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-syan-teal transition-colors cursor-pointer">
                <p className="text-gray-400 text-sm">Drag and drop logo file here or click to upload</p>
                <p className="text-[10px] text-gray-400 mt-1">SVG or PNG recommended (Max 2MB)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Contact & Social</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Public Email</label>
              <input type="email" defaultValue="info@syanmed.tech" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
              <input type="text" defaultValue="+92 300 0000000" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn Profile</label>
              <input type="text" defaultValue="https://linkedin.com/company/syanmed" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Twitter (X)</label>
              <input type="text" defaultValue="https://twitter.com/syanmed" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold">Discard Changes</button>
          <button className="px-8 py-2 bg-syan-teal text-white rounded-lg font-bold shadow-lg shadow-syan-teal/20">Save All Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
