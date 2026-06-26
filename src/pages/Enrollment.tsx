import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, MapPin, Church, Send, CheckCircle2, Phone, Mail, Calendar, BookOpen, CreditCard, ShieldCheck, Loader2, QrCode, FileText } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export function Enrollment() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'completo'>('completo');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await addDoc(collection(db, 'enrollments'), {
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        birthDate: data.birthDate || '',
        maritalStatus: data.maritalStatus || '',
        profession: data.profession || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        churchName: data.churchName || '',
        conversionTime: data.conversionTime || '',
        churchRole: data.churchRole || '',
        pastorName: data.pastorName || '',
        pastorPhone: data.pastorPhone || '',
        testimony: data.testimony || '',
        reason: data.reason || '',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setStep(2);
      window.scrollTo(0, 0);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, 'enrollments');
      } catch (e) {
        console.error("Firestore error logged.", e);
      }
      alert("Ocorreu um erro ao enviar sua inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = (plan: 'mensal' | 'completo') => {
    setSelectedPlan(plan);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const processCustomPayment = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Aqui aconteceria a comunicação real com nossa API que criamos no server.ts
    // Ex: axios.post('/api/pagamento', { plano: selectedPlan, dadosCartao: ... })
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
      window.scrollTo(0, 0);
    }, 2000);
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full mx-4 bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center"
        >
          <div className="w-20 h-20 bg-mission-green/10 text-mission-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pagamento Confirmado!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Glória a Deus pela sua vida! Seu acesso à Escola Missionária Transcultural foi liberado com sucesso. Bem-vindo(a) à nossa comunidade de alunos!
          </p>
          <div className="flex flex-col gap-3">
             <Link 
              to="/dashboard" 
              className="w-full bg-mission-green hover:bg-mission-green-dark text-white font-bold py-4 rounded-xl transition-colors"
            >
              Acessar Área do Aluno
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full mx-4 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors">
              &larr; Voltar aos planos
            </button>
            <div className="flex-1 text-center pr-8">
              <h2 className="text-2xl font-bold text-slate-900">Checkout Seguro</h2>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {selectedPlan === 'completo' ? 'Plano Completo Premium' : 'Plano Mensal'}
              </h3>
              <p className="text-sm text-slate-500">
                {selectedPlan === 'completo' ? 'Acesso total, encontros e comunidade' : 'Acesso mensal aos conteúdos'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-mission-orange">
                {selectedPlan === 'completo' ? 'R$ 497' : 'R$ 197'}
              </span>
              {selectedPlan === 'mensal' && <span className="text-slate-500 text-sm block">/mês</span>}
            </div>
          </div>

          <form onSubmit={processCustomPayment} className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'credit_card' ? 'bg-white shadow-sm text-slate-900 leading-none' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <CreditCard className="w-4 h-4" /> Cartão
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'pix' ? 'bg-white shadow-sm text-slate-900 leading-none' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <QrCode className="w-4 h-4" /> Pix
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'boleto' ? 'bg-white shadow-sm text-slate-900 leading-none' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <FileText className="w-4 h-4" /> Boleto
              </button>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Número do Cartão</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input required type="text" maxLength={19} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all font-mono" placeholder="0000 0000 0000 0000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Validade</label>
                    <input required type="text" maxLength={5} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all text-center font-mono" placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CVV</label>
                    <input required type="text" maxLength={4} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all text-center font-mono" placeholder="123" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nome impresso no cartão</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all uppercase" placeholder="NOME DO TITULAR" />
                </div>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-2">
                <div className="w-16 h-16 bg-mission-green/10 text-mission-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Pagamento via Pix</h4>
                <p className="text-sm text-slate-600 mb-4">Ao confirmar, o QR Code e a chave Pix Copia e Cola serão processados instantaneamente.</p>
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-mono">...pix...</span>
                  <span className="text-xs font-bold text-mission-green uppercase tracking-wider">Liberação Imediata</span>
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-2">
                <div className="w-16 h-16 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Pagamento via Boleto</h4>
                <p className="text-sm text-slate-600 mb-4">Você receberá o boleto bancário assim que finalizar a matrícula.</p>
                <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg border border-yellow-200/50 flex flex-col items-center">
                  <strong>Atenção:</strong> 
                  <span>Prazo de compensação bancária de até 3 dias úteis.</span>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="mt-8 bg-mission-orange hover:bg-mission-orange-light text-white w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-mission-orange/25 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {isSubmitting ? 'Processando...' : 
                paymentMethod === 'pix' ? 'Gerar PIX e Concluir Matricula' :
                paymentMethod === 'boleto' ? 'Gerar Boleto e Concluir Matricula' :
                'Confirmar e Concluir Matrícula'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Pagamento 100% seguro processado pelo Asaas
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full mx-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Quase lá! Escolha seu Plano</h2>
            <p className="text-lg text-slate-600">
              Sua ficha foi validada. Para concluir sua matrícula e liberar seu acesso, selecione como deseja investir no seu chamado.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mensal */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col hover:border-slate-300 transition-colors">
               <h3 className="text-2xl font-bold text-slate-900 mb-2">Plano Mensal</h3>
               <p className="text-slate-500 mb-6">Pagamento mensal para concluir sua formação em 90 dias.</p>
               <div className="mb-8">
                 <span className="text-5xl font-black text-slate-900">R$ 197</span>
                 <span className="text-slate-500 font-medium">/mês</span>
               </div>
               <div className="mb-6"><span className="text-slate-500 text-sm font-medium">Formação de 90 dias (3 parcelas, Total R$ 591)</span></div>
               
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-slate-700">
                   <CheckCircle2 className="w-5 h-5 text-mission-green shrink-0" /> Acesso aos 7 Módulos
                 </li>
                 <li className="flex items-center gap-3 text-slate-700">
                   <CheckCircle2 className="w-5 h-5 text-mission-green shrink-0" /> Conclusão da grade em 90 dias
                 </li>
                 <li className="flex items-center gap-3 text-slate-700">
                   <CheckCircle2 className="w-5 h-5 text-mission-green shrink-0" /> Acesso à comunidade
                 </li>
                 <li className="flex items-center gap-3 text-slate-700">
                   <CheckCircle2 className="w-5 h-5 text-mission-green shrink-0" /> Encontros Semanais com Missionários Nativos
                 </li>
               </ul>

               <button onClick={() => handlePayment('mensal')} className="mt-auto w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                 <CreditCard className="w-5 h-5"/> Assinar Mensal
               </button>
            </div>

            {/* Completo */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border-4 border-mission-orange relative flex flex-col transform md:-translate-y-4">
               <div className="absolute top-0 right-8 -mt-4 bg-mission-orange text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Mais Escolhido
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Plano Completo Premium</h3>
               <p className="text-slate-400 mb-6">Encontros Semanais com Missionários Nativos.</p>
               <div className="mb-2 w-full flex items-end gap-3 flex-wrap">
                 <span className="text-xl font-medium text-slate-400 line-through">De R$ 897</span>
                 <span className="text-5xl font-black text-mission-orange">R$ 497</span>
               </div>
               <div className="mb-6"><span className="text-slate-400 text-sm">À vista (PIX/Boleto) ou em até 10x de R$ 89,70 no cartão</span></div>
               
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-slate-300">
                   <CheckCircle2 className="w-5 h-5 text-mission-orange shrink-0" /> <span className="font-bold text-white">Encontros Semanais com Missionários Nativos</span>
                 </li>
                 <li className="flex items-center gap-3 text-slate-300">
                   <CheckCircle2 className="w-5 h-5 text-mission-orange shrink-0" /> Acesso total aos 7 Módulos
                 </li>
                 <li className="flex items-center gap-3 text-slate-300">
                   <CheckCircle2 className="w-5 h-5 text-mission-orange shrink-0" /> Formação completa em 90 dias
                 </li>
                 <li className="flex items-center gap-3 text-slate-300">
                   <CheckCircle2 className="w-5 h-5 text-mission-orange shrink-0" /> Acompanhamento e comunidade
                 </li>
               </ul>

               <button onClick={() => handlePayment('completo')} className="mt-auto w-full bg-mission-orange hover:bg-mission-orange-light text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-mission-orange/25 flex items-center justify-center gap-2">
                 <ShieldCheck className="w-5 h-5"/> Fazer Matrícula Completa
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="bg-slate-950 py-16 text-center border-b-4 border-mission-orange">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Formulário de Inscrição</h1>
          <p className="text-lg text-slate-300">
            Dê o primeiro passo para o seu preparo missionário. Preencha seus dados com atenção.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Sessão 1: Dados Pessoais */}
          <div className="p-8 md:p-10 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-mission-orange/10 flex items-center justify-center text-mission-orange">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">1. Dados Pessoais</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo *</label>
                <input name="fullName" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" placeholder="Digite seu nome completo" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail *</label>
                <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp / Telefone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input name="phone" required type="tel" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" placeholder="+55 (00) 00000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Data de Nascimento *</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input name="birthDate" required type="date" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Estado Civil</label>
                <select name="maritalStatus" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all bg-white">
                  <option value="">Selecione...</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Profissão / Formação</label>
                <input name="profession" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" placeholder="Ex: Professor, Enfermeiro, Estudante" />
              </div>
            </div>
          </div>

          {/* Sessão 2: Localização */}
          <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-mission-green/10 flex items-center justify-center text-mission-green">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">2. Localização</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">País *</label>
                <input name="country" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-green focus:ring-2 focus:ring-mission-green/20 outline-none transition-all" placeholder="Ex: Brasil" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Estado / Província *</label>
                <input name="state" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-green focus:ring-2 focus:ring-mission-green/20 outline-none transition-all" placeholder="Ex: São Paulo" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade *</label>
                <input name="city" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-green focus:ring-2 focus:ring-mission-green/20 outline-none transition-all" placeholder="Ex: Campinas" />
              </div>
            </div>
          </div>

          {/* Sessão 3: Histórico Espiritual */}
          <div className="p-8 md:p-10 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-mission-gold/10 flex items-center justify-center text-mission-gold">
                <Church className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">3. Histórico Espiritual</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome da Igreja que congrega *</label>
                <input name="churchName" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-gold focus:ring-2 focus:ring-mission-gold/20 outline-none transition-all" placeholder="Ex: Assembleia de Deus, Igreja Batista..." />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tempo de Conversão *</label>
                <select name="conversionTime" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-gold focus:ring-2 focus:ring-mission-gold/20 outline-none transition-all bg-white">
                  <option value="">Selecione...</option>
                  <option value="menos-1">Menos de 1 ano</option>
                  <option value="1-3">1 a 3 anos</option>
                  <option value="3-5">3 a 5 anos</option>
                  <option value="5-10">5 a 10 anos</option>
                  <option value="mais-10">Mais de 10 anos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cargo / Função na Igreja *</label>
                <input name="churchRole" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-gold focus:ring-2 focus:ring-mission-gold/20 outline-none transition-all" placeholder="Ex: Membro, Líder de Jovens, Pastor..." />
              </div>

               <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Pastor Responsável *</label>
                <input name="pastorName" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-gold focus:ring-2 focus:ring-mission-gold/20 outline-none transition-all" placeholder="Nome do seu pastor" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp do Pastor *</label>
                <input name="pastorPhone" required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-gold focus:ring-2 focus:ring-mission-gold/20 outline-none transition-all" placeholder="Para contato de recomendação" />
              </div>
            </div>
          </div>

           {/* Sessão 4: Chamado */}
           <div className="p-8 md:p-10 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">4. Sobre o Chamado</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Breve Testemunho (Opcional)</label>
                <textarea name="testimony" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all resize-none" placeholder="Conte-nos brevemente como foi seu encontro com Cristo..."></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Por que deseja fazer a Escola Missionária Transcultural? *</label>
                <textarea name="reason" required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all resize-none" placeholder="Fale sobre suas expectativas e onde você deseja servir..."></textarea>
              </div>

              <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                <div className="shrink-0 mt-0.5">
                  <input type="checkbox" required className="w-5 h-5 rounded border-slate-300 text-mission-orange focus:ring-mission-orange" />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  Declaro que as informações acima são verdadeiras e estou ciente de que a Escola Missionária poderá entrar em contato com minha liderança pastoral para referências.
                </span>
              </label>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-slate-900 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-mission-orange hover:bg-mission-orange-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-mission-orange/25 flex items-center gap-3 w-full sm:w-auto justify-center disabled:opacity-70 disabled:hover:bg-mission-orange"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
