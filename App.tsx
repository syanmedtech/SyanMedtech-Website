
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import PublicServices from './pages/PublicServices';
import PublicAbout from './pages/PublicAbout';
import PublicTeam from './pages/PublicTeam';
import PublicContact from './pages/PublicContact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSettings from './pages/AdminSettings';
import AdminServices from './pages/AdminServices';
import AdminTeam from './pages/AdminTeam';
import AdminContacts from './pages/AdminContacts';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

// Mock Auth Context (In real production, use Firebase Auth)
const AuthContext = React.createContext<{
  user: any;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
}>({
  user: null,
  login: async () => false,
  logout: () => {}
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  const login = async (u: string, p: string) => {
    // Demo login logic
    if (u === 'admin@syanmed.tech' && p === 'password123') {
      setUser({ email: u, role: 'SUPER_ADMIN' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );

  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return user ? (
      <div className="flex min-h-screen bg-syan-gray">
        <AdminSidebar onLogout={logout} user={user} />
        <div className="flex-1 ml-64 p-8">
          {children}
        </div>
      </div>
    ) : (
      <Navigate to="/admin/login" />
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><PublicHome /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><PublicServices /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><PublicAbout /></PublicLayout>} />
          <Route path="/team" element={<PublicLayout><PublicTeam /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><PublicContact /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin login={login} />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
          <Route path="/admin/services" element={<PrivateRoute><AdminServices /></PrivateRoute>} />
          <Route path="/admin/team" element={<PrivateRoute><AdminTeam /></PrivateRoute>} />
          <Route path="/admin/contacts" element={<PrivateRoute><AdminContacts /></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
