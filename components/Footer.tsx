
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-syan-dark text-white pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col mb-6">
              <span className="font-black text-xl tracking-tighter text-white leading-none">
                SYAN <span className="text-syan-sky">MED</span>
              </span>
              <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-gray-500 mt-1">Technology Ecosystem</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Pioneering medical technology solutions for the modern healthcare era. Empowering educators and professionals with secure, scalable platforms.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-syan-sky mb-8">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/team" className="hover:text-white transition-colors">Our Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-syan-sky mb-8">Modules</h4>
            <ul className="space-y-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <li className="hover:text-white transition-colors cursor-default">Online Exams</li>
              <li className="hover:text-white transition-colors cursor-default">Medical LMS</li>
              <li className="hover:text-white transition-colors cursor-default">Clinical AI</li>
              <li className="hover:text-white transition-colors cursor-default">EMR Dashboards</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-syan-sky mb-8">Registry Access</h4>
            <ul className="space-y-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/admin" className="text-syan-yellow hover:text-white transition-colors">Admin Console</Link></li>
              <li className="text-[9px] text-gray-500 mt-4 leading-relaxed">
                Medical City, Tech District<br />
                info@syanmed.tech
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-600 text-[9px] font-black uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} SYAN MED Tech. Precision Architecture.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Governance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
