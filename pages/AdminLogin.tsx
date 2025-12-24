
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC<{ login: (u: string, p: string) => Promise<boolean> }> = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Hint: admin@syanmed.tech / password123');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-syan-gray flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-syan-teal p-8 text-center text-white">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-syan-teal font-black text-3xl">S</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-teal-50/70 text-sm mt-1">SYAN MED Tech CMS Management</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-syan-teal outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              required
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-syan-teal outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-4 bg-syan-dark text-white font-bold rounded-xl hover:bg-syan-teal transition-all shadow-lg"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          <p className="text-center text-xs text-gray-400">
            Forgot password? Contact super admin.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
