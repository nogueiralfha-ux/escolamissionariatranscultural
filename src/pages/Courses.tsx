import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BookOpen, MapPin, Shield, Users, Flame, LayoutList, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

import * as LucideIcons from 'lucide-react';

function getIconComponent(iconName: string | any) {
  if (!iconName) return BookOpen;
  if (typeof iconName === 'function' || typeof iconName === 'object') return iconName;
  const Icon = (LucideIcons as any)[iconName];
  return Icon || BookOpen;
}

const curriculum = [
  {
    title: "Introdução",
    desc: "Boas-vindas, visão da escola e instruções iniciais.",
    icon: LayoutList,
    color: "bg-slate-500",
    image: "/modulo-intro.png",
    topics: ["Boas-vindas", "Visão da escola", "Instruções"]
  },
  {
    title: "Módulo 1: Fundamentos Bíblicos",
    desc: "A base teológica e bíblica do chamado.",
    icon: BookOpen,
    color: "bg-mission-gold",
    image: "/modulo-1.png",
    topics: ["Chamado missionário", "A Grande Comissão", "O coração de Deus", "Avivamento e missões"]
  },
  {
    title: "Módulo 2: Identidade Missionária",
    desc: "Forjando o caráter de Cristo para sobreviver no campo.",
    icon: Flame,
    color: "bg-mission-orange",
    image: "/modulo-2.png",
    topics: ["Caráter do missionário", "Santidade", "Disciplina espiritual", "Vida de oração"]
  },
  {
    title: "Módulo 3: Evangelismo Transcultural",
    desc: "Entendendo os povos não alcançados.",
    icon: MapPin,
    color: "bg-mission-green",
    image: "/modulo-3.png",
    topics: ["Culturas", "Adaptação", "Povos não alcançados", "Estratégias"]
  },
  {
    title: "Módulo 4: Batalha Espiritual",
    desc: "Armas espirituais para avançar no Reino.",
    icon: Shield,
    color: "bg-slate-800",
    image: "/modulo-4.png",
    topics: ["Intercessão", "Jejum", "Guerra espiritual", "Libertação"]
  },
  {
    title: "Módulo 5: Implantação e Logística",
    desc: "Os desafios práticos de chegar e permanecer no campo.",
    icon: Users,
    color: "bg-mission-orange-light",
    image: "/modulo-5.png",
    topics: ["Viagens", "Suporte", "Liderança", "Sobrevivência no campo"]
  },
  {
    title: "Módulo 6: Liderança e Discipulado",
    desc: "Cuidando de si e das ovelhas.",
    icon: Users,
    color: "bg-mission-green-dark",
    image: "/modulo-6.png",
    topics: ["Liderança cristã", "Discipulado", "Cuidado pastoral", "Formação de líderes"]
  },
  {
    title: "Módulo 7: Projeto Final",
    desc: "Colocando em prática tudo que foi aprendido.",
    icon: Trophy,
    color: "bg-mission-gold-light",
    image: "/modulo-7.png",
    topics: ["Relatório", "Evangelismo prático", "Apresentação", "Consagração"]
  }
];

export function Courses() {
  const [modules, setModules] = useState<any[]>(curriculum);

  useEffect(() => {
    async function loadCurriculum() {
      try {
        const querySnapshot = await getDocs(collection(db, 'curriculum'));
        const modulesData: any[] = [];
        querySnapshot.forEach((doc) => {
          modulesData.push({ id: doc.id, ...doc.data() });
        });
        if (modulesData.length > 0) {
          modulesData.sort((a, b) => a.order - b.order);
          setModules(modulesData);

          // Self-healing database check: if some documents are missing images, write them
          let neededMigration = false;
          for (let i = 0; i < modulesData.length; i++) {
            if (!modulesData[i].image) {
              neededMigration = true;
              break;
            }
          }

          if (neededMigration) {
            console.log("Iniciando auto-migração de imagens do currículo...");
            const { doc: firestoreDoc, setDoc } = await import('firebase/firestore');
            for (let i = 0; i < modulesData.length; i++) {
              const mod = modulesData[i];
              if (!mod.image) {
                const matchedDefault = curriculum.find(def => def.title === mod.title);
                if (matchedDefault) {
                  await setDoc(firestoreDoc(db, 'curriculum', mod.id), {
                    image: matchedDefault.image,
                    color: matchedDefault.color,
                    icon: matchedDefault.icon
                  }, { merge: true });
                  mod.image = matchedDefault.image;
                  mod.color = matchedDefault.color;
                  mod.icon = matchedDefault.icon;
                }
              }
            }
            setModules([...modulesData]);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar grade do Firestore, usando fallback:", err);
      }
    }
    loadCurriculum();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Estrutura Curricular</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Nosso programa completo é desenhado para transformar vocacionados em missionários preparados teológica, emocional, e estrategicamente.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((mod, index) => {
            const Icon = getIconComponent(mod.icon);
            const imageSrc = mod.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80";
            const colorClass = mod.color || "bg-slate-500";
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-full md:w-48 shrink-0 relative min-h-[160px] md:min-h-full bg-slate-900">
                  <img 
                    src={imageSrc} 
                    alt={mod.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                  />
                  <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center ${colorClass} text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{mod.title}</h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">{mod.desc}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {mod.topics.map((t, i) => (
                      <li key={i} className="flex items-center text-xs text-slate-700 gap-2 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-mission-orange" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  );
}
