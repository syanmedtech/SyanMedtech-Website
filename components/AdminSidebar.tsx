
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC<{ onLogout: () => void, user: any }> = ({ onLogout, user }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M4 6h16M4 12h16M4 18h16' },
    { name: 'Visual Editor', path: '/admin/page-editor', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { name: 'Store Management', path: '/admin/store', icon: 'M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.244a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 21h4.5V15a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v6h4.5' },
    { name: 'Services', path: '/admin/services', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.288a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 001.442 2.342l2.387.477a6 6 0 003.86-.517l.628-.288a6 6 0 013.86-.517l2.387.477a2 2 0 002.342-1.442l.477-2.387a2 2 0 00-.547-1.022l-1.16-1.16z' },
    { name: 'Blogs', path: '/admin/blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
    { name: 'Team', path: '/admin/team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Contacts', path: '/admin/contacts', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-syan-dark text-white flex flex-col">
      <div className="p-8">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-syan-sky rounded flex items-center justify-center">
            <span className="font-bold text-white">S</span>
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path ? 'bg-syan-teal text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {typeof item.icon === 'string' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              ) : null}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-syan-teal flex items-center justify-center font-bold">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user.email}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
