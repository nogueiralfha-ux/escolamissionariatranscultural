import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== 'nogueiralfha@gmail.com') {
      setError('Acesso restrito apenas para o administrador.');
      return;
    }

    if (password !== 'missionario405') {
      setError('Senha incorreta.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Tentar login
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('admin_session', 'true');
      navigate('/admin', { replace: true });
    } catch (err: any) {
      // Se o usuário não existir, vamos criá-lo automaticamente
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          localStorage.setItem('admin_session', 'true');
          navigate('/admin', { replace: true });
        } catch (createErr) {
          console.error(createErr);
          setError('Erro ao criar usuário administrador no Firebase.');
        }
      } else {
        console.error(err);
        setError('Erro na autenticação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
          <ShieldCheck className="w-8 h-8 text-white -rotate-3" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Acesso Restrito</h1>
        <p className="text-slate-500 text-sm mb-8">
          Área administrativa exclusiva. Insira suas credenciais.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 mb-6 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail Administrativo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
            ) : (
              <Lock className="w-5 h-5" />
            )}
            {isLoading ? 'Autenticando...' : 'Acessar Painel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
