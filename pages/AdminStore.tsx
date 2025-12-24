
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerce.ts';
import { Product, Order } from '../types.ts';
// Added SectionLabel to fix errors on lines 140, 157, and 166
import { ICONS, SectionLabel } from '../constants.tsx';
import { db } from '../services/firestore.ts';

const AdminStore: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await ecommerceService.getProducts();
    const o = await ecommerceService.getOrders();
    setProducts(p);
    setOrders(o);
    setLoading(false);
  };

  const updateStock = async (id: string, newStock: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const updated = { ...product, stock: newStock };
    await db.save('products', id, updated);
    loadData();
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 uppercase font-black text-xs">Loading Store Data...</div>;

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-syan-dark tracking-tight uppercase">Store Command</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Medical Inventory & Global Logistics Control.</p>
        </div>
        <div className="flex bg-white rounded-2xl border border-gray-100 p-1">
          {(['inventory', 'orders', 'analytics'] as const).map(v => (
            <button 
              key={v}
              onClick={() => setView(v)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                view === v ? 'bg-syan-teal text-white shadow-lg' : 'text-gray-400 hover:text-syan-teal'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === 'inventory' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-syan-gray/50 border-b border-gray-100">
                <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Product</th>
                <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Category</th>
                <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Price</th>
                <th className="px-10 py-5 text-left text-[9px] uppercase font-black tracking-widest text-gray-400">Stock</th>
                <th className="px-10 py-5 text-right text-[9px] uppercase font-black tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-syan-gray/30 transition-colors">
                  <td className="px-10 py-6 flex items-center space-x-4">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover grayscale" />
                    <span className="font-bold text-syan-dark uppercase tracking-tight text-sm">{p.name}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-2 py-0.5 bg-syan-gray rounded text-[8px] font-black uppercase tracking-widest text-gray-400">{p.category}</span>
                  </td>
                  <td className="px-10 py-6 font-bold text-syan-teal">${p.price.toLocaleString()}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-black ${p.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>{p.stock} Units</span>
                      <button onClick={() => updateStock(p.id, p.stock + 1)} className="text-gray-300 hover:text-syan-teal transition-colors font-black">+</button>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="text-syan-sky hover:text-syan-teal font-black uppercase text-[9px] tracking-[0.2em]">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'orders' && (
        <div className="space-y-6">
          {orders.length > 0 ? orders.map(o => (
            <div key={o.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center space-x-8">
                <div className="w-12 h-12 bg-syan-gray rounded-xl flex items-center justify-center">
                  <ICONS.Clinic className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-syan-dark uppercase tracking-tight">{o.customerName}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{o.customerEmail} • {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Items</p>
                <p className="font-bold text-syan-dark">{o.items.length}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total</p>
                <p className="font-black text-syan-teal tracking-tighter">${o.total.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-6">
                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                   o.status === 'Processing' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'
                 }`}>{o.status}</span>
                 <button className="p-2 text-gray-300 hover:text-syan-teal transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2.5}/></svg>
                 </button>
              </div>
            </div>
          )) : (
            <div className="bg-white p-32 text-center rounded-[3rem] border border-gray-100">
               <p className="text-gray-300 font-black uppercase tracking-widest">No active procurement logs.</p>
            </div>
          )}
        </div>
      )}

      {view === 'analytics' && (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <SectionLabel num="Metrics" text="Procurement Volume" />
            <h3 className="serif text-3xl text-syan-dark mb-12">Institutional Sales Delta</h3>
            
            <div className="h-64 flex items-end space-x-4">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                <div key={i} className="flex-grow bg-syan-gray rounded-t-xl relative group hover:bg-syan-teal transition-all duration-500">
                  <div className="absolute bottom-0 w-full bg-syan-teal/20 group-hover:bg-syan-teal/40 transition-all rounded-t-xl" style={{ height: `${h}%` }}></div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-syan-dark p-10 rounded-[2.5rem] text-white shadow-xl">
               <SectionLabel num="Stats" text="Financial Velocity" />
               <p className="text-syan-sky text-[10px] font-black uppercase tracking-widest mb-2">Total Managed Revenue</p>
               <h4 className="text-4xl font-black tracking-tighter mb-8">${totalRevenue.toLocaleString()}</h4>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Average Order Value</p>
                  <p className="text-xl font-black text-syan-sky">$874.50</p>
               </div>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100">
               <SectionLabel num="Logistics" text="Inventory Health" />
               <div className="space-y-6">
                 {products.slice(0, 3).map(p => (
                   <div key={p.id}>
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-gray-400 truncate max-w-[150px]">{p.name}</span>
                        <span className={p.stock < 20 ? 'text-red-500' : 'text-syan-teal'}>{p.stock}% Stock</span>
                     </div>
                     <div className="h-1.5 w-full bg-syan-gray rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock < 20 ? 'bg-red-500' : 'bg-syan-teal'}`} style={{ width: `${Math.min(100, p.stock)}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStore;
