import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Smartphone, Download, ExternalLink, Library, BookMarked, Globe, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface ResourceItem {
  id: string;
  title: string;
  type: string;
  category: string;
  image: string;
  description: string;
  actionText: string;
  link: string;
  order: number;
}

const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: "default_1",
    title: "Como saber se Deus está te chamando?",
    type: "E-book Exclusivo",
    category: "E-books e Literatura",
    image: "https://i.ibb.co/0RkqSPbP/Chat-GPT-Image-18-de-mai-de-2026-13-09-13.png",
    description: "Um guia prático para entender os sinais e a voz de Deus para o seu chamado transcultural.",
    actionText: "Baixar Grátis",
    link: "https://ameimissoes.online/wp-content/uploads/2026/05/como-saber-se-Deus-esta-te-chamando.pdf",
    order: 0
  },
  {
    id: "default_2",
    title: "Guia Prático de Evangelismo",
    type: "Manual",
    category: "E-books e Literatura",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80",
    description: "Aprenda a abordar pessoas e compartilhar o Evangelho em diferentes contextos e culturas.",
    actionText: "Adquirir",
    link: "/checkout?product=literature_1",
    order: 1
  },
  {
    id: "default_3",
    title: "App Escola Missionária",
    type: "Aplicativo Mobile",
    category: "Aplicativos e Ferramentas",
    image: "https://i.ibb.co/zTvK3vc1/escola-missionaria-aplicativo.png",
    description: "Assista aulas offline, interaja com a comunidade e receba devocionais diários pelo celular.",
    actionText: "Em Breve",
    link: "#",
    order: 2
  },
  {
    id: "default_4",
    title: "Atlas de Povos Não Alcançados",
    type: "Web App",
    category: "Aplicativos e Ferramentas",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80",
    description: "Mapeamento em tempo real de etnias e grupos minoritários para direcionamento de oração.",
    actionText: "Acessar Plataforma",
    link: "/atlas",
    order: 3
  }
];

export function Resources() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lead capture states
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [leadName, setLeadName] = useState(() => localStorage.getItem('lead_name') || '');
  const [leadEmail, setLeadEmail] = useState(() => localStorage.getItem('lead_email') || '');
  const [leadPhone, setLeadPhone] = useState(() => localStorage.getItem('lead_phone') || '');
  const [submittingLead, setSubmittingLead] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        const querySnapshot = await getDocs(collection(db, 'resources'));
        const list: ResourceItem[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as ResourceItem);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setResources(list);
        } else {
          setResources(DEFAULT_RESOURCES);
        }
      } catch (error) {
        console.error("Erro ao carregar recursos do Firestore, usando padrões:", error);
        setResources(DEFAULT_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  const handleDownloadClick = (e: React.MouseEvent, item: ResourceItem) => {
    // Check if the action is actually a free download
    const actionTextLower = item.actionText.toLowerCase();
    const isFreeDownload = actionTextLower.includes('baixar') || actionTextLower.includes('download') || actionTextLower.includes('grátis') || actionTextLower.includes('gratis');

    if (isFreeDownload) {
      e.preventDefault();
      
      const leadCaptured = localStorage.getItem('lead_captured') === 'true';
      if (leadCaptured) {
        window.open(item.link, '_blank');
      } else {
        setSelectedResource(item);
        setShowLeadModal(true);
      }
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadPhone || !selectedResource) return;

    setSubmittingLead(true);
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'leads'), {
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        resourceId: selectedResource.id,
        resourceTitle: selectedResource.title,
        createdAt: serverTimestamp()
      });

      localStorage.setItem('lead_captured', 'true');
      localStorage.setItem('lead_name', leadName);
      localStorage.setItem('lead_email', leadEmail);
      localStorage.setItem('lead_phone', leadPhone);

      setShowLeadModal(false);
      window.open(selectedResource.link, '_blank');
    } catch (err) {
      console.error("Erro ao salvar lead de download:", err);
      // Fallback: still open link
      setShowLeadModal(false);
      window.open(selectedResource.link, '_blank');
    } finally {
      setSubmittingLead(false);
    }
  };

  // Group resources by category
  const categoriesMap: { [key: string]: ResourceItem[] } = {};
  resources.forEach(item => {
    const cat = item.category || 'Outros';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(item);
  });

  const categoryList = Object.keys(categoriesMap).map(catName => {
    let icon = BookOpen;
    if (catName.toLowerCase().includes('livro') || catName.toLowerCase().includes('literatura')) {
      icon = Library;
    } else if (catName.toLowerCase().includes('app') || catName.toLowerCase().includes('ferramenta') || catName.toLowerCase().includes('aplicativo')) {
      icon = Smartphone;
    }

    return {
      title: catName,
      icon,
      description: catName === 'E-books e Literatura' 
        ? "Materiais aprofundados para o seu crescimento bíblico e missiológico." 
        : catName === 'Aplicativos e Ferramentas'
        ? "Tecnologia a serviço do Reino para te ajudar no dia a dia no campo."
        : "Recursos de apoio para sua jornada ministerial.",
      items: categoriesMap[catName]
    };
  });

  // Helper for determining action icon
  const getActionIcon = (actionText: string) => {
    const text = actionText.toLowerCase();
    if (text.includes('baixar') || text.includes('download') || text.includes('grátis') || text.includes('gratis')) {
      return Download;
    }
    if (text.includes('adquirir') || text.includes('comprar') || text.includes('checkout') || text.includes('loja')) {
      return BookMarked;
    }
    if (text.includes('acessar') || text.includes('plataforma') || text.includes('abrir') || text.includes('entrar')) {
      return Globe;
    }
    return ExternalLink;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header */}
      <div className="bg-slate-900 py-16 text-center border-b-4 border-mission-orange">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Recursos e Materiais</h1>
          <p className="text-xl text-slate-300">
            Equipe-se com nossos livros, aplicativos e guias desenvolvidos para fortalecer seu chamado e sua atuação estratégica na obra de Deus.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-mission-orange animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Carregando recursos...</p>
          </div>
        ) : (
          categoryList.map((category, idx) => (
            <div key={idx} className="mb-20 last:mb-0">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-mission-orange/10 flex items-center justify-center text-mission-orange border border-mission-orange/20">
                  <category.icon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{category.title}</h2>
                  <p className="text-slate-600 font-medium">{category.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {category.items.map((item, itemIdx) => {
                  const ActionIcon = getActionIcon(item.actionText);
                  const isExternal = item.link.startsWith('http') || item.link.startsWith('www') || item.link.startsWith('mailto:');
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIdx * 0.1 }}
                      key={item.id || itemIdx} 
                      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 group hover:shadow-xl hover:border-mission-orange/30 transition-all flex flex-col sm:flex-row"
                    >
                      <div className="sm:w-2/5 md:w-1/3 relative bg-slate-100 shrink-0 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover min-h-[200px] group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <div className="p-6 md:p-8 flex flex-col flex-1 justify-center">
                        <div className="text-xs font-bold uppercase tracking-wider text-mission-green mb-2">{item.type}</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{item.title}</h3>
                        <p className="text-slate-600 mb-6 text-sm flex-1 leading-relaxed">{item.description}</p>
                        
                        {isExternal ? (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => handleDownloadClick(e, item)}
                            className="inline-flex items-center gap-2 font-bold text-mission-orange hover:text-mission-orange-dark transition-colors self-start group cursor-pointer"
                          >
                            <ActionIcon className="w-5 h-5" />
                            {item.actionText}
                          </a>
                        ) : (
                          <Link 
                            to={item.link} 
                            onClick={(e) => handleDownloadClick(e, item)}
                            className="inline-flex items-center gap-2 font-bold text-mission-orange hover:text-mission-orange-dark transition-colors self-start group cursor-pointer"
                          >
                            <ActionIcon className="w-5 h-5" />
                            {item.actionText}
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        
        {/* Banner de Doação / Ajuda */}
         <div className="mt-16 bg-gradient-to-br from-mission-green to-mission-green-dark rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
             <BookOpen className="w-64 h-64" />
           </div>
           
           <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold mb-4">Apoie nosso ministério de publicações</h2>
             <p className="text-mission-green-light mb-8 text-lg">
               Todo o valor arrecadado com a venda dos nossos materiais é revertido para o impulsionamento de missões em campos não alcançados e sustentação do projeto.
             </p>
             <Link to="/doacoes" className="bg-white text-mission-green hover:bg-slate-50 px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2">
               Quero Apoiar a Obra <ExternalLink className="w-5 h-5"/>
             </Link>
           </div>
         </div>

      </div>

      {/* Lead Capture Modal */}
      {showLeadModal && selectedResource && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left relative overflow-hidden"
          >
            <button 
              onClick={() => setShowLeadModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Libere seu Download</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Para fazer o download gratuito de <span className="text-mission-orange font-bold">"{selectedResource.title}"</span>, preencha os dados abaixo para receber o link de acesso imediato.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none text-sm transition-all text-slate-950 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">E-mail</label>
                <input 
                  type="email" 
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none text-sm transition-all text-slate-950 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">WhatsApp / Celular</label>
                <input 
                  type="tel" 
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Ex: 11999999999"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none text-sm transition-all text-slate-950 font-medium"
                />
              </div>

              <button 
                type="submit" 
                disabled={submittingLead}
                className="w-full bg-mission-orange hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submittingLead ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Salvando dados...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Baixar Agora
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
