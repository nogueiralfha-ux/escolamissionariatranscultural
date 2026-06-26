import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Heart, Sparkles, BookOpen, Clock, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const upcomingApps = [
  {
    title: "Mulheres de Fé",
    description: "Devocional diário focado no encorajamento e fortalecimento feminino através das histórias bíblicas.",
    color: "bg-rose-100 text-rose-600 border-rose-200",
    icon: Heart
  },
  {
    title: "Caminhos do Coração",
    description: "Meditações curtas sobre cura interior, propósito e alinhamento emocional com a Palavra.",
    color: "bg-indigo-100 text-indigo-600 border-indigo-200",
    icon: Sparkles
  },
  {
    title: "O Missionário",
    description: "Reflexões ardentes e radicais para manter o fogo do chamado aceso durante a jornada ministerial.",
    color: "bg-mission-orange/10 text-mission-orange border-mission-orange/20",
    icon: BookOpen
  }
];

export function Devotionals() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'waitlist'), {
        email,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setEmail("");
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, 'waitlist');
      } catch (e) {
        console.error("Firestore error logged.", e);
      }
      setStatus('idle');
      alert("Ocorreu um erro ao assinar a lista de espera. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="bg-slate-900 py-16 text-center border-b-4 border-mission-orange">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-mission-orange/20 text-mission-orange-light px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
            <Smartphone className="w-5 h-5" /> Aplicativos em Breve
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Nossos Devocionais</h1>
          <p className="text-xl text-slate-300">
            Estamos preparando uma nova experiência para o seu tempo diário com Deus. Assinaturas de devocionais em formato de aplicativo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {upcomingApps.map((app, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-slate-100"></div>
              
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${app.color}`}>
                <app.icon className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{app.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed flex-1">{app.description}</p>
              
              <div className="w-full bg-slate-100 p-4 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-sm border border-slate-200 border-dashed">
                <Clock className="w-5 h-5"/> Lançamento em Breve
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-center text-white border-4 flex flex-col items-center border-slate-800 transition-all duration-300">
          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-mission-green/20 rounded-full flex items-center justify-center mb-6 border border-mission-green/30">
                <CheckCircle2 className="w-10 h-10 text-mission-green" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Você está na lista!</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Seu e-mail foi registrado com sucesso. Entraremos em contato assim que os devocionais estiverem disponíveis para download.
              </p>
            </motion.div>
          ) : (
            <>
              <Lock className="w-16 h-16 text-slate-600 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Assine Nossa Lista de Espera</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                Seja o primeiro a saber quando nossos aplicativos devocionais estiverem disponíveis e ganhe condições especiais de assinatura!
              </p>
              <form onSubmit={handleWaitlistSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail" 
                  required
                  disabled={status === 'submitting'}
                  className="flex-1 px-6 py-4 rounded-full border-none bg-white text-slate-900 outline-none font-medium focus:ring-2 focus:ring-mission-orange disabled:opacity-70" 
                />
                <button 
                  type="submit"
                  disabled={status === 'submitting' || !email.trim()}
                  className="bg-mission-orange flex items-center justify-center min-w-[140px] hover:bg-mission-orange-light px-8 py-4 rounded-full font-bold transition-colors disabled:opacity-70 disabled:hover:bg-mission-orange"
                >
                  {status === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Avisar-me'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
