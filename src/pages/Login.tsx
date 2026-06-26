import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('O login foi cancelado pelo usuário.');
      } else {
        setError('Ocorreu um erro ao fazer login com o Google. Use a opção de Email simulada abaixo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === 'aluno@email.com' && password === '123456') {
      // Simula uma sessão local para fins de demonstração
      localStorage.setItem('user_session', JSON.stringify({ email, name: 'Aluno Simulado' }));
      // Recarrega ou redireciona
      window.location.href = '/dashboard';
    } else {
      setError('Credenciais inválidas. Use o e-mail: aluno@email.com e senha: 123456');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Lock className="w-8 h-8 text-white -rotate-3" />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Área do Aluno
            </h1>
            <p className="text-slate-500 text-sm">
              Entre para acessar o conteúdo de estudos da Escola Missionária.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!showEmailLogin ? (
            <div className="space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  'Processando...'
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Continuar com o Google
                  </>
                )}
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold">Ou</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                onClick={() => setShowEmailLogin(true)}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 border border-slate-300 rounded-xl transition-all text-sm"
              >
                Entrar com E-mail e Senha
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">E-mail</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange outline-none text-sm transition-all"
                  placeholder="aluno@email.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Senha</label>
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange outline-none text-sm transition-all"
                  placeholder="••••••" 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-6"
              >
                Entrar
              </button>
              
              <button 
                type="button"
                onClick={() => setShowEmailLogin(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-mission-orange underline font-semibold mt-2"
              >
                Voltar para Login do Google
              </button>
            </form>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 text-blue-900 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
          <div className="text-sm">
            <span className="font-bold block mb-1">Trava de Segurança Financeira Automática Ativada</span>
            Se o aluno estiver com o pagamento ativo, ele acessa as aulas normalmente. Se cancelar ou atrasar a assinatura, o sistema bloqueia o acesso instantaneamente.
          </div>
        </div>

      </div>
    </div>
  );
}

