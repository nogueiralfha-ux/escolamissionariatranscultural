/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { StudentDashboard } from './pages/StudentDashboard';
import { Enrollment } from './pages/Enrollment';
import { Projects } from './pages/Projects';
import { Resources } from './pages/Resources';
import { About } from './pages/About';
import { Donation } from './pages/Donation';
import { Shop } from './pages/Shop';
import { Devotionals } from './pages/Devotionals';
import { Library } from './pages/Library';
import { Atlas } from './pages/Atlas';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { Checkout } from './pages/Checkout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, toggleSubscriptionStatus } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-mission-orange animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o aluno deixou de pagar a assinatura ou foi bloqueado
  if (profile && profile.status === 'blocked') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Bloqueado</h2>
          <p className="text-slate-600 mb-6">
            Não identificamos o pagamento da sua assinatura mensal. Por favor, regularize sua situação financeira para liberar o acesso às aulas.
          </p>
          <a href="/doacoes" className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors">
            Regularizar Assinatura
          </a>
          <button 
            onClick={toggleSubscriptionStatus}
            className="mt-4 text-sm text-slate-500 hover:text-mission-orange underline w-full"
          >
            Apenas simulando? Clique aqui para restaurar o acesso
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cursos" element={<Courses />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/inscricao" element={<Enrollment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/recursos" element={<Resources />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/doacoes" element={<Donation />} />
              
              <Route path="/loja" element={<Shop />} />
              <Route path="/devocionais" element={<Devotionals />} />
              <Route path="/biblioteca" element={<Library />} />
              <Route path="/atlas" element={<Atlas />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
