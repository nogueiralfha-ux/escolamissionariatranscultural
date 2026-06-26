import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, Target, Heart, Shield, BookOpen, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface TeacherItem {
  id: string;
  name: string;
  subject: string;
  bio: string;
  image: string;
  order: number;
}

const DEFAULT_TEACHERS: TeacherItem[] = [
  {
    id: "default_1",
    name: "Pr. Alexandre Nogueira",
    subject: "Teologia Missiológica & Plantação de Igrejas",
    bio: "Mais de 15 anos de experiência prática e pastoral em campos nacionais e transculturais. Fundador e coordenador da Escola Missionária.",
    image: "https://i.ibb.co/8Lq8yfn6/logo-para-facebook.png",
    order: 0
  },
  {
    id: "default_2",
    name: "Prof. Marcos Souza",
    subject: "Inteligência Cultural & Antropologia",
    bio: "Doutor em Ciências da Religião, com foco em comunicação transcultural e análise de cosmovisões de povos minoritários.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    order: 1
  }
];

export function About() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeachers() {
      try {
        const querySnapshot = await getDocs(collection(db, 'teachers'));
        const list: TeacherItem[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as TeacherItem);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setTeachers(list);
        } else {
          setTeachers(DEFAULT_TEACHERS);
        }
      } catch (error) {
        console.error("Erro ao carregar professores, usando padrão:", error);
        setTeachers(DEFAULT_TEACHERS);
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 py-20 text-center border-b-4 border-mission-orange relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img 
            src="https://images.unsplash.com/photo-1529070538774-1843cb5265df?auto=format&fit=crop&q=80" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-mission-green/20 text-mission-green-light px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
            <Globe className="w-5 h-5" /> Nossa História e Visão
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Formando a Nova Geração de Missionários</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            A Escola Missionária Transcultural nasceu com um propósito claro: equipar homens e mulheres para o cumprimento da Grande Comissão, aliando base bíblica sólida à prática de campo.
          </p>
          <div className="inline-flex items-center gap-3 bg-mission-orange text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-mission-orange/20 animate-pulse">
             Matrículas Abertas para Novas Turmas!
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Coordination Section */}
        <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-xl border border-slate-100 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-mission-orange/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="order-2 lg:order-1">
              <div className="inline-block text-mission-orange font-bold tracking-wider uppercase text-sm mb-2">Coordenação Geral</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Uma Vida Dedicada ao Campo Missionário</h2>
              <div className="prose prose-lg text-slate-600 mb-8">
                <p>
                  A Escola é liderada por um Coordenador Geral com <strong>mais de 15 anos de experiência prática e pastoral em missões</strong>, atuando ativamente tanto em solo nacional quanto em contextos transculturais desafiadores.
                </p>
                <p>
                  Essa bagagem de mais de uma década e meia não é composta apenas de teorias, mas de vivências reais: plantação de igrejas, adaptação cultural profunda, superação de barreiras linguísticas e o impacto real do Evangelho transformando vidas e comunidades.
                </p>
                <p>
                  Toda essa experiência empírica estruturou nossa grade curricular atual de 90 dias, que vai direto ao ponto. Nela, unimos o fervor espiritual com ferramentas missiológicas práticas, focando estritamente no que realmente funciona e no que é fundamental no campo.
                </p>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 bg-mission-gold/20 rounded-full flex items-center justify-center text-mission-gold shrink-0">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">15+ Anos de Campo Ativo</div>
                  <div className="text-sm text-slate-500 font-medium">Experiência Nacional e Transcultural</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
               <div className="relative aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                 <img 
                    src="https://i.ibb.co/8Lq8yfn6/logo-para-facebook.png" 
                    alt="Liderança Missionária" 
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-8">
                    <div>
                      <div className="text-white font-bold text-2xl mb-1">Liderança Forjada na Prática</div>
                      <div className="text-mission-orange-light font-medium tracking-wide">A experiência que guia o nosso ensino</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nossos Pilares</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">O que sustenta o nosso ensino e direciona nossas estratégias no treinamento obreiros aprovados.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Centralidade nas Escrituras</h3>
              <p className="text-slate-600 leading-relaxed">Acreditamos que a Palavra de Deus é a base inegociável de toda estratégia missionária. O chamado autêntico nasce da obediência à Bíblia Sagrada.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 bg-mission-green/10 text-mission-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Inteligência Cultural</h3>
              <p className="text-slate-600 leading-relaxed">Capacitamos novos missionários para entender, respeitar e se comunicar de forma efetiva com diferentes povos e cosmovisões mundiais.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 bg-mission-orange/10 text-mission-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Compaixão em Ação</h3>
              <p className="text-slate-600 leading-relaxed">Missões trata sobre amar através da ação. Ensinamos a aliar a pregação vibrante com o cuidado social contínuo àqueles que mais necessitam.</p>
            </div>
          </div>
        </div>
        {/* Corpo Docente */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nosso Corpo Docente</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Aprenda com missionários e professores experientes que vivem o que ensinam no dia a dia do campo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {teachers.map((teacher, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={teacher.id || index}
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg border border-slate-100 flex flex-col sm:flex-row gap-6 items-start hover:shadow-xl hover:border-mission-orange/20 transition-all"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{teacher.name}</h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-mission-orange mb-3">
                    {teacher.subject}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {teacher.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-center text-white border-4 border-mission-orange/30 overflow-hidden relative">
           <div className="absolute top-0 right-0 opacity-10">
              <Target className="w-64 h-64 transform translate-x-1/4 -translate-y-1/4" />
           </div>
           <div className="relative z-10 max-w-3xl mx-auto">
             <div className="inline-block bg-white/10 px-4 py-2 rounded-full font-medium text-mission-orange-light mb-6 backdrop-blur-md">
               Nova Turma Disponível
             </div>
             <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Está pronto para responder ao seu chamado vocacional?</h2>
             <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
               Junte-se à nossa nova turma e seja treinado por quem tem a vida inteira devotada ao altar e muita poeira do campo missionário nos pés. Sua jornada ministerial começa agora.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link 
                 to="/inscricao" 
                 className="bg-mission-orange hover:bg-mission-orange-light text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-mission-orange/20 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
               >
                 Garantir Minha Vaga na Turma <ArrowRight className="w-5 h-5"/>
               </Link>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
