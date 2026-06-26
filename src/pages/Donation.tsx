import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Gift, BookOpen, CreditCard, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Donation() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number | 'custom'>(50);
  const [customValue, setCustomValue] = useState<string>('');

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(e.target.value.replace(/\D/g, ''));
    setSelectedPlan('custom');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header */}
      <div className="bg-slate-900 py-16 text-center border-b-4 border-mission-orange relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Heart className="w-full h-full text-white transform scale-150 rotate-12" />
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-mission-orange/20 text-mission-orange-light px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
            <Heart className="w-5 h-5 fill-current" /> Propósito Eterno
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Apoie a Obra Missionária</h1>
          <p className="text-xl text-slate-300">
            Sua contribuição sustenta projetos em campos não alcançados, viabiliza literaturas e forma novos missionários para as nações.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-10">
        
        {/* Toggle Modalidade */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full inline-flex shadow-md border border-slate-200">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${!isAnnual ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Oferta Avulsa
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-mission-orange text-white shadow-lg' : 'text-slate-500 hover:text-mission-orange'}`}
            >
               Parceiro Mantenedor <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Clube VIP</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isAnnual ? 'Seja um Parceiro Mantenedor' : 'Fazer uma Oferta Avulsa'}
            </h2>
            <p className="text-slate-600 mb-8">
              {isAnnual 
                ? 'Assuma um compromisso fiel com missões (plano anual pago mensalmente).' 
                : 'Contribua com o valor que Deus colocar no seu coração.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[50, 100, 200].map((value) => (
                <button
                  key={value}
                  onClick={() => { setSelectedPlan(value); setCustomValue(''); }}
                  className={`py-4 rounded-2xl border-2 font-bold text-xl transition-all ${selectedPlan === value ? 'border-mission-orange bg-mission-orange/5 text-mission-orange' : 'border-slate-200 text-slate-600 hover:border-mission-orange/50'}`}
                >
                  R$ {value}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2">Outro Valor (R$)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 font-bold text-slate-400">R$</span>
                <input 
                  type="text" 
                  value={customValue}
                  onChange={handleCustomValueChange}
                  placeholder="0,00"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-bold text-xl transition-all ${selectedPlan === 'custom' ? 'border-mission-orange bg-mission-orange/5' : 'border-slate-200 focus:border-mission-orange/50'}`}
                />
              </div>
              {isAnnual && (selectedPlan === 'custom' ? parseInt(customValue || '0') < 50 : selectedPlan < 50) && (
                 <p className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1">
                   O valor mínimo para os benefícios de Parceiro Mantenedor é R$ 50,00 mensais.
                 </p>
              )}
            </div>

            {/* Form Dados */}
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="Nome Completo *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none" />
              <input type="email" placeholder="E-mail *" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none" />
            </div>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg">
              <CreditCard className="w-5 h-5" /> 
              {isAnnual ? 'Confirmar Apoio Mensal' : 'Enviar Oferta Agora'}
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-mission-green" /> Pagamento 100% Seguro e Criptografado
            </div>
          </div>

          {/* Benefícios Sidebar */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={isAnnual ? 'annual' : 'single'}
              className={`rounded-3xl p-8 h-full flex flex-col ${isAnnual ? 'bg-mission-orange text-white shadow-xl' : 'bg-slate-100 text-slate-900 border border-slate-200'}`}
            >
               {isAnnual ? (
                 <>
                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                     <Gift className="w-7 h-7 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Clube de Mantenedores</h3>
                   <p className="text-white/80 mb-6 font-medium">
                     Ao assumir o compromisso mensal (mínimo R$ 50/mês), você se torna parte integrante do nosso suporte e recebe benefícios exclusivos:
                   </p>
                   
                   <ul className="space-y-5 flex-1">
                     <li className="flex gap-3">
                       <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                       <div>
                         <span className="font-bold block">20% de Desconto</span>
                         <span className="text-sm text-white/80">Em todos os nossos livros, materiais e produtos da loja.</span>
                       </div>
                     </li>
                     <li className="flex gap-3">
                       <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                       <div>
                         <span className="font-bold block">E-book Gratuito a cada 3 meses</span>
                         <span className="text-sm text-white/80">Lançamentos exclusivos direto no seu e-mail para seu crescimento.</span>
                       </div>
                     </li>
                     <li className="flex gap-3">
                       <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                       <div>
                         <span className="font-bold block">Relatório de Impacto</span>
                         <span className="text-sm text-white/80">Boletim mensal relatando onde seu recurso foi investido no campo.</span>
                       </div>
                     </li>
                   </ul>
                 </>
               ) : (
                 <>
                   <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center mb-6">
                     <Heart className="w-7 h-7 text-slate-600" />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Gratidão!</h3>
                   <p className="text-slate-600 mb-6 font-medium">
                     Toda semente é bem-vinda para o avanço da obra. Sua oferta avulsa ajuda nas frentes de missões emergenciais.
                   </p>
                   <ul className="space-y-4">
                     <li className="flex items-center gap-3 text-slate-700 font-medium">
                       <CheckCircle2 className="w-5 h-5 text-mission-green" /> Apoio direto ao campo
                     </li>
                     <li className="flex items-center gap-3 text-slate-700 font-medium">
                       <CheckCircle2 className="w-5 h-5 text-mission-green" /> Recibos via e-mail
                     </li>
                   </ul>
                 </>
               )}
            </motion.div>
          </div>

        </div>

        {/* Info */}
        <div className="mt-16 text-center bg-slate-100 p-8 rounded-3xl border border-slate-200 max-w-3xl mx-auto">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Transparência e Prestação de Contas</h3>
          <p className="text-slate-600 leading-relaxed">
            A Escola Missionária Transcultural e seus projetos são auditados anualmente. Levamos a sério a administração dos recursos do Reino. Caso tenha dúvidas sobre para onde as verbas são destinadas, entre em contato com nossa equipe administrativa.
          </p>
        </div>

      </div>
    </div>
  );
}
