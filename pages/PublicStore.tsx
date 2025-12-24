
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerce.ts';
import { Product } from '../types.ts';
import { ICONS, SectionLabel } from '../constants.tsx';

const PublicStore: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await ecommerceService.getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) {
      setFilteredProducts(products);
      return;
    }

    setIsSearching(true);
    const matchedIds = await ecommerceService.aiSmartSearch(search, products);
    if (matchedIds.length > 0) {
      setFilteredProducts(products.filter(p => matchedIds.includes(p.id)));
    } else {
      setFilteredProducts([]);
    }
    setIsSearching(false);
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('syan_cart') || '[]');
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('syan_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert(`${product.name} added to cart!`);
  };

  const categories = ['All', 'Software', 'Hardware', 'Diagnostic', 'Research'];

  return (
    <div className="bg-syan-gray min-h-screen">
      {/* Hero / Search */}
      <section className="bg-white py-16 px-6 lg:px-20 border-b border-syan-sky/10">
        <div className="max-w-[1400px] mx-auto">
          <SectionLabel num="Medical Store" text="Institutional Procurement" />
          <h1 className="serif text-5xl lg:text-6xl text-syan-dark mb-8 leading-tight">
            Advanced Clinical <span className="text-syan-teal italic">Inventory</span>.
          </h1>
          
          <form onSubmit={handleAiSearch} className="max-w-2xl relative">
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by specialty (e.g., 'tools for pediatric surgery')..." 
              className="w-full pl-6 pr-40 py-5 bg-syan-gray border border-gray-100 rounded-2xl outline-none focus:border-syan-teal font-medium text-sm transition-all"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 px-6 py-3 bg-syan-dark text-syan-sky rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-syan-teal hover:text-white transition-all disabled:opacity-50"
            >
              {isSearching ? 'Analyzing...' : 'AI Smart Search'}
            </button>
          </form>
        </div>
      </section>

      {/* Categories & Grid */}
      <section className="py-12 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setFilteredProducts(cat === 'All' ? products : products.filter(p => p.category === cat));
                }}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  category === cat 
                  ? 'bg-syan-teal text-white shadow-lg' 
                  : 'bg-white text-gray-400 hover:text-syan-teal border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-syan-teal text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="serif text-2xl text-syan-dark mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">MSRP</span>
                      <span className="text-2xl font-black text-syan-teal tracking-tighter">${product.price.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="px-6 py-3 bg-syan-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-syan-teal transition-all shadow-md active:scale-95"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-300 font-black uppercase tracking-widest">No matching medical products found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicStore;
