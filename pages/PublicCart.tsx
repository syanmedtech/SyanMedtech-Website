
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ICONS, SectionLabel } from '../constants.tsx';
import { CartItem } from '../types.ts';

const PublicCart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('syan_cart') || '[]');
    setCart(saved);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('syan_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('syan_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (checkoutStep === 'cart') setCheckoutStep('shipping');
    else if (checkoutStep === 'shipping') setCheckoutStep('payment');
    else if (checkoutStep === 'payment') {
      setCheckoutStep('success');
      localStorage.removeItem('syan_cart');
      window.dispatchEvent(new Event('storage'));
    }
  };

  if (checkoutStep === 'success') {
    return (
      <div className="bg-syan-gray min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center">
          <div className="w-20 h-20 bg-syan-teal/10 text-syan-teal rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="serif text-3xl text-syan-dark mb-4">Order Transmitted.</h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">Your medical procurement request has been indexed. Our logistics team will initiate fulfillment within 12 hours.</p>
          <Link to="/store" className="block w-full py-4 bg-syan-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-syan-teal transition-all">
            Return To Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-syan-gray min-h-screen py-16 px-6 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-8">
            <SectionLabel num="Checkout" text={checkoutStep === 'cart' ? 'Review Order' : 'Procurement Details'} />
            <h1 className="serif text-4xl text-syan-dark mb-12 capitalize">{checkoutStep} Phase</h1>

            {checkoutStep === 'cart' && (
              <div className="space-y-6">
                {cart.length > 0 ? cart.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center space-x-6 group">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-syan-dark">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.category}</p>
                    </div>
                    <div className="flex items-center space-x-4 bg-syan-gray px-3 py-1.5 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-syan-teal font-black">-</button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-syan-teal font-black">+</button>
                    </div>
                    <div className="text-right w-24">
                      <p className="font-black text-syan-teal tracking-tighter">${(item.price * item.quantity).toLocaleString()}</p>
                      <button onClick={() => removeItem(item.id)} className="text-[9px] text-red-300 hover:text-red-500 font-black uppercase tracking-widest mt-1">Remove</button>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-300 font-black uppercase tracking-widest">Cart is currently empty.</p>
                    <Link to="/store" className="mt-4 inline-block text-syan-teal font-bold text-xs underline">Back To Store</Link>
                  </div>
                )}
              </div>
            )}

            {checkoutStep === 'shipping' && (
              <div className="bg-white p-10 rounded-3xl border border-gray-100 space-y-8 animate-in slide-in-from-right-4">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-2">Institutional Name</label>
                    <input type="text" className="w-full bg-syan-gray border rounded-xl px-5 py-3 outline-none focus:border-syan-teal" placeholder="City General Hospital" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-2">Facility ID</label>
                    <input type="text" className="w-full bg-syan-gray border rounded-xl px-5 py-3 outline-none focus:border-syan-teal" placeholder="MD-88219" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-2">Loading Dock Address</label>
                  <textarea rows={3} className="w-full bg-syan-gray border rounded-xl px-5 py-3 outline-none focus:border-syan-teal" placeholder="Full technical shipping address..."></textarea>
                </div>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="bg-white p-10 rounded-3xl border border-gray-100 space-y-8 animate-in slide-in-from-right-4">
                <div className="p-8 bg-syan-dark rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ICONS.AI className="w-24 h-24" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-syan-sky mb-8">Clinical Credit Account</p>
                  <div className="space-y-6">
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-lg font-mono placeholder:text-white/20 outline-none" placeholder="XXXX XXXX XXXX XXXX" />
                    <div className="grid grid-cols-2 gap-6">
                      <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-mono placeholder:text-white/20 outline-none" placeholder="MM/YY" />
                      <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-mono placeholder:text-white/20 outline-none" placeholder="CVC" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Secured by clinical SSL 256-bit encryption</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <h3 className="serif text-2xl text-syan-dark mb-8">Summary</h3>
              
              <div className="space-y-4 mb-10 pb-10 border-b border-gray-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="font-bold text-syan-dark">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Logistics (Est)</span>
                  <span className="font-bold text-syan-dark">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Compliance Fee</span>
                  <span className="font-bold text-syan-dark">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Pay</span>
                <span className="text-3xl font-black text-syan-teal tracking-tighter">${total.toLocaleString()}</span>
              </div>

              <button 
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full py-5 bg-syan-teal text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-syan-teal/20 hover:bg-syan-dark transition-all disabled:opacity-50"
              >
                {checkoutStep === 'cart' ? 'Proceed To Logistics' : checkoutStep === 'shipping' ? 'Secure Payment' : 'Confirm Procurement'}
              </button>

              <div className="mt-8 text-center">
                <Link to="/store" className="text-[9px] font-black uppercase text-gray-400 tracking-widest hover:text-syan-teal transition-colors">Continue Browsing</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicCart;
