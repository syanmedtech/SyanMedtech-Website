import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F6F8F9]/80 backdrop-blur-md border-b border-syan-sky/10">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-syan-teal leading-none">
              SYAN <span className="text-syan-sky">MED</span>
            </span>
            <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-gray-400 mt-0.5">Technology Ecosystem</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[10px] uppercase font-bold tracking-widest transition-all hover:text-syan-teal ${
                  isActive(link.path) ? 'text-syan-teal' : 'text-gray-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
            <Link
              to="/contact"
              className="px-5 py-2 bg-syan-teal text-white rounded-md text-[10px] uppercase font-black tracking-widest hover:bg-syan-dark transition-all shadow-sm"
            >
              Request Access
            </Link>
          </nav>

          <button 
            className="lg:hidden p-2 text-syan-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="block text-xs uppercase font-black tracking-widest text-gray-600 hover:text-syan-teal"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="block text-center py-3 bg-syan-teal text-white rounded-md font-black text-[10px] uppercase tracking-widest"
          >
            Request Access
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;