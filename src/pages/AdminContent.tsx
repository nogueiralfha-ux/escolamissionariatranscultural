import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  desc: string;
  topics: string[];
  order: number;
}

const DEFAULT_CURRICULUM: Omit<Module, 'id'>[] = [
  {
    title: "Introdução",
    desc: "Boas-vindas, visão da escola e instruções iniciais.",
    topics: ["Boas-vindas", "Visão da escola", "Instruções"],
    order: 0
  },
  {
    title: "Módulo 1: Fundamentos Bíblicos",
    desc: "A base teológica e bíblica do chamado.",
    topics: ["Chamado missionário", "A Grande Comissão", "O coração de Deus", "Avivamento e missões"],
    order: 1
  },
  {
    title: "Módulo 2: Identidade Missionária",
    desc: "Forjando o caráter de Cristo para sobreviver no campo.",
    topics: ["Caráter do missionário", "Santidade", "Disciplina espiritual", "Vida de oração"],
    order: 2
  },
  {
    title: "Módulo 3: Evangelismo Transcultural",
    desc: "Entendendo os povos não alcançados.",
    topics: ["Culturas", "Adaptação", "Povos não alcançados", "Estratégias"],
    order: 3
  },
  {
    title: "Módulo 4: Batalha Espiritual",
    desc: "Armas espirituais para avançar no Reino.",
    topics: ["Intercessão", "Jejum", "Guerra espiritual", "Libertação"],
    order: 4
  },
  {
    title: "Módulo 5: Implantação e Logística",
    desc: "Os desafios práticos de chegar e permanecer no campo.",
    topics: ["Viagens", "Suporte", "Liderança", "Sobrevivência no campo"],
    order: 5
  },
  {
    title: "Módulo 6: Liderança e Discipulado",
    desc: "Cuidando de si e das ovelhas.",
    topics: ["Liderança cristã", "Discipulado", "Cuidado pastoral", "Formação de líderes"],
    order: 6
  },
  {
    title: "Módulo 7: Projeto Final",
    desc: "Colocando em prática tudo que foi aprendido.",
    topics: ["Relatório", "Evangelismo prático", "Apresentação", "Consagração"],
    order: 7
  }
];

export function AdminContent() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [topicsInput, setTopicsInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'curriculum'));
      const modulesData: Module[] = [];
      querySnapshot.forEach((doc) => {
        modulesData.push({ id: doc.id, ...doc.data() } as Module);
      });

      // If Firestore is empty, seed it with default curriculum
      if (modulesData.length === 0) {
        console.log("Seeding default curriculum...");
        for (let i = 0; i < DEFAULT_CURRICULUM.length; i++) {
          const newId = `module_${i}`;
          await setDoc(doc(db, 'curriculum', newId), DEFAULT_CURRICULUM[i]);
          modulesData.push({ id: newId, ...DEFAULT_CURRICULUM[i] });
        }
      }

      modulesData.sort((a, b) => a.order - b.order);
      setModules(modulesData);
    } catch (err: any) {
      console.error("Erro ao buscar conteúdo", err);
      setError("Falha ao carregar conteúdo do Firestore: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleEditClick = (mod: Module) => {
    setIsEditing(mod.id);
    setTitle(mod.title);
    setDesc(mod.desc);
    setTopicsInput(mod.topics.join('\n'));
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(null);
    setTitle('');
    setDesc('');
    setTopicsInput('');
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setError('');
  };

  const handleSave = async (id?: string) => {
    if (!title || !desc) {
      setError("Título e Descrição são obrigatórios.");
      return;
    }

    setSaving(true);
    setError('');

    const parsedTopics = topicsInput
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const targetId = id || `module_${Date.now()}`;
      const docData = {
        title,
        desc,
        topics: parsedTopics,
        order: id ? (modules.find(m => m.id === id)?.order ?? modules.length) : modules.length
      };

      await setDoc(doc(db, 'curriculum', targetId), docData);
      setIsEditing(null);
      setIsAdding(false);
      fetchModules();
    } catch (err: any) {
      console.error(err);
      setError("Erro ao salvar no Firestore: " + (err?.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este módulo/tópico?")) {
      try {
        await deleteDoc(doc(db, 'curriculum', id));
        fetchModules();
      } catch (err: any) {
        console.error(err);
        setError("Erro ao excluir módulo: " + (err?.message || String(err)));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-mission-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Gestão de Grade Curricular e Conteúdos</h3>
          <p className="text-sm text-slate-500">Adicione e edite os módulos do curso, aulas, vídeos e materiais complementares.</p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={handleAddClick}
            className="bg-mission-orange hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" /> Novo Módulo
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Editor Form */}
      {(isAdding || isEditing) && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-base">
            {isAdding ? "Adicionar Novo Módulo" : "Editar Módulo"}
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Título do Módulo</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Módulo 1: Fundamentos Bíblicos"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Descrição do Módulo</label>
              <textarea 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Uma breve descrição sobre a ementa do módulo..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Tópicos / Aulas (Um por linha)</label>
              <textarea 
                value={topicsInput} 
                onChange={(e) => setTopicsInput(e.target.value)}
                placeholder="Chamado Missionário&#10;A Grande Comissão&#10;Teologia Bíblica de Missões"
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button 
              onClick={() => handleSave(isEditing || undefined)}
              disabled={saving}
              className="bg-mission-orange hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : "Salvar Módulo"}
            </button>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="grid grid-cols-1 gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-mission-orange/10 text-mission-orange flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{mod.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{mod.desc}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {mod.topics.map((topic, i) => (
                    <span key={i} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded-md">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
              <button 
                onClick={() => handleEditClick(mod)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(mod.id)}
                className="p-2 border border-red-100 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
