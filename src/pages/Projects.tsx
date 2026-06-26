import { motion } from 'motion/react';
import { Map, Calendar, Users, Heart, ArrowRight, Shield, Luggage } from 'lucide-react';
import { Link } from 'react-router-dom';

const immersions = [
  {
    id: 1,
    title: "Expedição Andes - Peru",
    location: "Cordilheira dos Andes, Peru",
    date: "Há Definir",
    duration: "15 dias",
    image: "https://i.ibb.co/VRhHbsQ/Gemini-Generated-Image-cszwc2cszwc2cszw.png",
    description: "Uma imersão profunda em comunidades andinas de difícil acesso. Trabalharemos com evangelismo infantil, discipulado de líderes locais e atendimentos básicos de saúde.",
    tags: ["Transcultural", "Alta Altitude", "Evangelismo"]
  },
  {
    id: 2,
    title: "Missão Sertão",
    location: "Sertão Nordestino, Brasil",
    date: "Setembro",
    duration: "10 dias",
    image: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80",
    description: "Apoio a igrejas em áreas de seca extrema. Nossa equipe levará a palavra de esperança, distribuição de água, Bíblias e ações sociais para a comunidade local.",
    tags: ["Ação Social", "Clima Semiárido", "Sertão"]
  }
];

export function Projects() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header */}
      <div className="bg-slate-900 py-20 text-center border-b-4 border-mission-orange relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img 
            src="https://images.unsplash.com/photo-1518182170546-076616fdcefd?auto=format&fit=crop&q=80" 
            alt="Background" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-mission-orange/20 text-mission-orange-light px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
            <Map className="w-5 h-5" /> A Prática do Chamado
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Projetos de Imersão</h1>
          <p className="text-xl text-slate-300">
            Saia da sala de aula e vá para o campo. Nossas imersões transculturais oferecem a oportunidade de viver na prática o amor de Cristo, servindo comunidades não alcançadas ao redor do mundo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Why participate */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
             <div className="w-16 h-16 bg-mission-green/10 text-mission-green rounded-full flex items-center justify-center mx-auto mb-6">
               <Heart className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">Impacto Real</h3>
             <p className="text-slate-600 leading-relaxed">
               Leve ações sociais e a mensagem do Evangelho onde há maior necessidade e carência espiritual.
             </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
             <div className="w-16 h-16 bg-mission-orange/10 text-mission-orange rounded-full flex items-center justify-center mx-auto mb-6">
               <Shield className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">Choque Cultural</h3>
             <p className="text-slate-600 leading-relaxed">
               Aprenda a lidar com diferentes visões de mundo, fortalecendo sua cosmovisão bíblica em campo.
             </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
             <div className="w-16 h-16 bg-mission-gold/10 text-mission-gold rounded-full flex items-center justify-center mx-auto mb-6">
               <Users className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">Trabalho em Equipe</h3>
             <p className="text-slate-600 leading-relaxed">
               Desenvolva liderança e submissão, servindo junto com seus irmãos em missões de alta intensidade.
             </p>
          </div>
        </div>

        {/* Project List */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Próximas Imersões</h2>
          <p className="text-lg text-slate-600 mb-10">Conheça os campos que estamos nos preparando para atuar.</p>

          <div className="space-y-12">
            {immersions.map((immersion, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={immersion.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col lg:flex-row group"
              >
                <div className="lg:w-2/5 relative overflow-hidden h-64 lg:h-auto">
                  <img 
                    src={immersion.image} 
                    alt={immersion.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent lg:hidden flex items-end p-6">
                    <h3 className="text-2xl font-bold text-white tracking-widest uppercase">{immersion.title}</h3>
                  </div>
                </div>
                
                <div className="p-8 md:p-12 lg:w-3/5 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 hidden lg:block tracking-tight">{immersion.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Map className="w-5 h-5 text-mission-orange" /> {immersion.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Calendar className="w-5 h-5 text-mission-green" /> {immersion.date}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                       <Luggage className="w-5 h-5 text-mission-gold" /> {immersion.duration}
                    </div>
                  </div>

                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    {immersion.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {immersion.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link 
                      to="/inscricao" 
                      className="inline-flex items-center gap-3 bg-mission-orange hover:bg-mission-orange-light text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-mission-orange/25 group-hover:-translate-y-1"
                    >
                      Manifestar Interesse <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white border-4 border-slate-800/50">
           <h2 className="text-3xl md:text-4xl font-bold mb-6">Ainda tem dúvidas sobre as imersões?</h2>
           <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
             Nossa equipe está à disposição para esclarecer informações sobre custos, logística, segurança e preparo espiritual para cada campo.
           </p>
           <a href="https://wa.me/5516997327255?text=Ola%2C%20quero%20falar%20com%20a%20Mentoria%2C%20sobre%20a%20imers%C3%A3o!!" target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-colors inline-block">
             Falar com a Mentoria
           </a>
        </div>

      </div>
    </div>
  );
}
