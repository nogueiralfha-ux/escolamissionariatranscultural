import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, BookOpen, Map, Heart, Users, ChevronRight, PlayCircle, Download as DownloadedIcon, Smartphone, Bell, X, Phone, User } from 'lucide-react';

export function Home() {
  const [showEbookModal, setShowEbookModal] = useState(false);
  const [ebookForm, setEbookForm] = useState({ name: '', phone: '' });

  const handleEbookSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = `Olá! Meu nome é ${ebookForm.name} (WhatsApp: ${ebookForm.phone}) e gostaria de receber o E-book: "Como saber se Deus está te chamando para Missões?".`;
    const whatsappUrl = `https://wa.me/5516997327255?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowEbookModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[40rem] h-[40rem] bg-mission-orange/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[40rem] h-[40rem] bg-mission-green/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mission-orange/20 text-mission-orange-light border border-mission-orange/30 text-sm font-medium mb-6">
                <Globe className="w-4 h-4" />
                <span>Matrículas Abertas 2026</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                Preparando missionários para alcançar as <span className="text-transparent bg-clip-text bg-gradient-to-r from-mission-orange to-mission-gold">nações.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
                Um treinamento intensivo, bíblico e prático para quem tem o chamado de levar avivamento e a mensagem do Reino aos povos não alcançados.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  to="/inscricao" 
                  className="bg-mission-orange hover:bg-mission-orange-light text-white px-8 py-4 rounded-full font-medium text-lg transition-all shadow-lg hover:shadow-mission-orange/25 flex items-center gap-2"
                >
                  Começar Agora <ChevronRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/cursos" 
                  className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 px-8 py-4 rounded-full font-medium text-lg transition-all flex items-center gap-2"
                >
                  Conheça os Cursos
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-mission-orange to-mission-gold opacity-30 blur-2xl"></div>
              <img 
                src="/banner.png" 
                alt="Missionários em campo" 
                referrerPolicy="no-referrer"
                className="relative rounded-[2rem] border border-white/10 shadow-2xl object-cover w-full"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 bg-mission-green/10 rounded-full flex items-center justify-center text-mission-green">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Treinamento</p>
                  <p className="text-slate-900 font-bold">Transcultural</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features/Pillars */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nossa Metodologia</h2>
            <p className="text-lg text-slate-600">Uma formação completa estruturada em pilares fundamentais para preparar o vocacionado para os desafios do campo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-mission-green/30 transition-colors group">
              <div className="w-14 h-14 bg-mission-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-mission-green group-hover:text-white transition-all text-mission-green">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Fundamentos Bíblicos</h3>
              <p className="text-slate-600 leading-relaxed">Mergulho profundo na Palavra, entendendo o coração missionário de Deus e a teologia de missões.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-mission-orange/30 transition-colors group">
              <div className="w-14 h-14 bg-mission-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-mission-orange group-hover:text-white transition-all text-mission-orange">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Identidade & Caráter</h3>
              <p className="text-slate-600 leading-relaxed">Tratamento de caráter, vida de oração, santidade e disciplina espiritual para forjar verdadeiros líderes.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-mission-gold/30 transition-colors group">
              <div className="w-14 h-14 bg-mission-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-mission-gold group-hover:text-white transition-all text-mission-gold">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Prática Transcultural</h3>
              <p className="text-slate-600 leading-relaxed">Estratégias de evangelismo, plantação de igrejas e sobrevivência em culturas desafiadoras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video/Testimonial Teaser */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">O campo é o mundo, e a seara está pronta.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Junte-se a centenas de alunos que estão sendo preparados para transformar realidades em locais de pouca ou nenhuma presença cristã. Nossa escola oferece suporte pastoral, mentoria e direcionamento prático.
              </p>
              <ul className="space-y-4 mb-8">
                {['Professores com experiência real de campo', 'Acesso a Biblioteca Digital e materiais', 'Comunidade ativa e intercessão'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-mission-green/20 flex items-center justify-center text-mission-green">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/sobre" className="inline-flex items-center font-semibold text-mission-green hover:text-mission-green-dark transition-colors gap-1">
                Conheça nossos professores <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl aspect-video bg-slate-900 flex items-center justify-center">
              <video 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                playsInline
                loop 
                muted
              >
                <source src="https://ameimissoes.online/wp-content/uploads/2026/05/Crie_um_video_cinematografico.mp4" type="video/mp4" />
                Seu navegador não suporta a visualização deste vídeo.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Imersão Missionária Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Imersão Missionária no Sertão</h2>
            <p className="text-lg text-slate-600">
              Viva a experiência de missão na prática no sertão nordestino. Nossas imersões levam você ao campo para apoiar comunidades locais e levar o amor e a esperança de Cristo de forma transcultural.
            </p>
          </div>
          
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-100 relative group">
            <img 
              src="/missao-sertao.png" 
              alt="Imersão Missão Sertão Nordestino" 
              referrerPolicy="no-referrer"
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover overlay with CTA */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link 
                  to="/projetos" 
                  className="bg-mission-orange hover:bg-mission-orange-light text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2"
                >
                  Saiba mais sobre as Expedições <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* E-book Section */}
      <section className="relative py-24 overflow-hidden bg-slate-900 border-y border-slate-800">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80" 
            alt="Paisagem montanhas" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mission-orange/20 text-mission-orange-light border border-mission-orange/30 text-sm font-bold tracking-wider uppercase">
                <BookOpen className="w-4 h-4" />
                E-book Gratuito
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Como saber se <span className="text-mission-gold">Deus</span> está te chamando para <span className="text-mission-orange">Missões?</span>
              </h2>
              
              <p className="text-xl text-slate-300 italic">
                Descubra o propósito que pode transformar a sua vida e alcançar nações para Cristo.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-6">
                {[
                  { title: "Discernir o Chamado", desc: "Entenda se Deus está realmente chamando você." },
                  { title: "Sinais Espirituais", desc: "Aprenda a reconhecer sinais reais do Espírito Santo." },
                  { title: "Vencer Dúvidas", desc: "Supere inseguranças e fortaleça sua fé." },
                  { title: "Processo Bíblico", desc: "Veja o caminho bíblico do coração à comissão." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                      <Heart className="w-5 h-5 text-mission-orange" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => setShowEbookModal(true)}
                  className="bg-mission-gold hover:bg-mission-gold-light text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-mission-gold/25 inline-flex items-center gap-2"
                >
                  Baixar E-book Agora <DownloadedIcon />
                </button>
                <p className="mt-4 text-sm text-slate-400 font-medium font-serif italic">
                  "A quem enviarei? Eis-me aqui, envia-me a mim." – Isaías 6:8
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md rounded-lg shadow-2xl overflow-hidden border-8 border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://i.ibb.co/0RkqSPbP/Chat-GPT-Image-18-de-mai-de-2026-13-09-13.png" 
                  alt="Capa do E-book" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border-[12px] border-slate-900 bg-slate-900 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-10 rounded-t-3xl flex justify-center">
                   <div className="w-16 h-4 bg-slate-950 rounded-b-xl"></div>
                </div>
                <img 
                  src="https://i.ibb.co/zTvK3vc1/escola-missionaria-aplicativo.png" 
                  alt="Aplicativo Escola Missionária" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mission-green/10 text-mission-green-dark border border-mission-green/20 text-sm font-bold tracking-wider uppercase">
                <Smartphone className="w-4 h-4" />
                Aplicativo Futuro
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                A Escola Missionária <span className="text-mission-green">na palma</span> da sua mão.
              </h2>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                Estude onde e quando quiser. Em breve, lançaremos nosso aplicativo oficial com recursos exclusivos para potencializar sua preparação missionária, com base offline e interações em tempo real.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: PlayCircle, title: "Assistir Aulas", desc: "Acesse todo o conteúdo em vídeo." },
                  { icon: DownloadedIcon, title: "Baixar PDFs", desc: "Material didático offline." },
                  { icon: Bell, title: "Notificações", desc: "Alertas de oração e novas aulas." },
                  { icon: Users, title: "Comunidade", desc: "Interaja com os outros alunos." }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm text-mission-green">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-mission-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Pronto para responder ao Chamado?</h2>
          <p className="text-xl text-mission-green-light mb-10 text-white/80">Faça sua inscrição hoje e tenha acesso imediato aos módulos fundamentais, à comunidade e aos recursos exclusivos da Escola Missionária.</p>
          <Link 
            to="/inscricao" 
            className="inline-flex bg-white text-mission-green hover:bg-slate-50 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 items-center gap-2"
          >
            Fazer Inscrição Agora
          </Link>
        </div>
      </section>

      {/* E-book Modal */}
      <AnimatePresence>
        {showEbookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <form onSubmit={handleEbookSubmit} className="max-w-md w-full relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 shadow-2xl"
              >
                <button 
                  type="button"
                  onClick={() => setShowEbookModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="w-16 h-16 bg-mission-gold/10 text-mission-gold rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Para onde enviamos o E-book?</h3>
                <p className="text-slate-600 mb-6">Preencha seus dados para receber o link de download diretamente no seu WhatsApp.</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Seu Nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required 
                        value={ebookForm.name}
                        onChange={e => setEbookForm({...ebookForm, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-mission-gold focus:ring-2 focus:ring-mission-gold/20 outline-none transition-all" 
                        placeholder="Nome completo" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        required 
                        value={ebookForm.phone}
                        onChange={e => setEbookForm({...ebookForm, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-mission-gold focus:ring-2 focus:ring-mission-gold/20 outline-none transition-all" 
                        placeholder="+55 (00) 00000-0000" 
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-mission-gold hover:bg-mission-gold-light text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Receber no WhatsApp
                </button>
              </motion.div>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
