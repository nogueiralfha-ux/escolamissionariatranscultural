import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Save, X, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface StudentMaterial {
  id: string;
  title: string;
  desc: string;
  link: string;
  module: string;
  order: number;
}

const DEFAULT_MATERIALS: Omit<StudentMaterial, 'id'>[] = [
  {
    title: "Mapa Panorâmico da Bíblia",
    desc: "Um guia visual completo mostrando o panorama cronológico e temático dos livros da Bíblia.",
    link: "https://ameimissoes.online/wp-content/uploads/2026/05/mapa-panoramico-da-biblia.pdf", // Mock link
    module: "Módulo 1: Fundamentos Bíblicos",
    order: 0
  },
  {
    title: "Manual Prático do Campo Transcultural",
    desc: "Instruções operacionais e dicas de sobrevivência, adaptação cultural e saúde no campo.",
    link: "https://ameimissoes.online/wp-content/uploads/2026/05/manual-campo.pdf", // Mock link
    module: "Módulo 3: Evangelismo Transcultural",
    order: 1
  }
];

export function AdminStudentMaterials() {
  const [materials, setMaterials] = useState<StudentMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [module, setModule] = useState('Geral');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'student_materials'));
      const list: StudentMaterial[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as StudentMaterial);
      });

      // Seed if empty
      if (list.length === 0) {
        console.log("Seeding default student materials...");
        for (let i = 0; i < DEFAULT_MATERIALS.length; i++) {
          const newId = `material_${i}`;
          await setDoc(doc(db, 'student_materials', newId), DEFAULT_MATERIALS[i]);
          list.push({ id: newId, ...DEFAULT_MATERIALS[i] });
        }
      }

      list.sort((a, b) => a.order - b.order);
      setMaterials(list);
    } catch (err: any) {
      console.error("Erro ao buscar materiais dos alunos", err);
      setError('Erro ao carregar os materiais do Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleStartAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setTitle('');
    setDesc('');
    setLink('');
    setModule('Geral');
    setError('');
  };

  const handleStartEdit = (item: StudentMaterial) => {
    setIsEditing(item.id);
    setIsAdding(false);
    setTitle(item.title);
    setDesc(item.desc);
    setLink(item.link);
    setModule(item.module);
    setError('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !link) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const isNew = isAdding;
      const targetId = isNew ? `material_${Date.now()}` : (isEditing as string);
      
      const materialData = {
        title,
        desc,
        link,
        module,
        order: isNew ? materials.length : (materials.find(m => m.id === targetId)?.order ?? 0)
      };

      await setDoc(doc(db, 'student_materials', targetId), materialData);
      
      setIsAdding(false);
      setIsEditing(null);
      await fetchMaterials();
    } catch (err: any) {
      console.error("Erro ao salvar material do aluno", err);
      setError('Erro ao salvar o material no Firestore. Verifique a conexão ou regras.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este material?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'student_materials', id));
      await fetchMaterials();
    } catch (err: any) {
      console.error("Erro ao excluir material do aluno", err);
      setError('Erro ao remover o material do Firestore.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-mission-orange" />
            Gestão de Materiais de Apoio (Exclusivo dos Alunos)
          </h3>
          <p className="text-slate-500 text-xs mt-1">Insira PDFs, mapas e apostilas que ficarão visíveis somente na Área do Aluno logado.</p>
        </div>
        {!isAdding && !isEditing && (
          <button
            onClick={handleStartAdd}
            className="bg-mission-orange hover:bg-orange-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Material
          </button>
        )}
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Add / Edit Form */}
        {(isAdding || isEditing) && (
          <form onSubmit={handleSave} className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              {isAdding ? 'Adicionar Novo Material para Alunos' : 'Editar Material do Aluno'}
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2">Título do Material *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mapa Panorâmico da Bíblia"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2">Módulo Associado (Para Organização)</label>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none font-medium"
                >
                  <option value="Geral">Geral (Disponível sempre)</option>
                  <option value="Introdução">Introdução</option>
                  <option value="Módulo 1: Fundamentos Bíblicos">Módulo 1: Fundamentos Bíblicos</option>
                  <option value="Módulo 2: Identidade Missionária">Módulo 2: Identidade Missionária</option>
                  <option value="Módulo 3: Evangelismo Transcultural">Módulo 3: Evangelismo Transcultural</option>
                  <option value="Módulo 4: Batalha Espiritual">Módulo 4: Batalha Espiritual</option>
                  <option value="Módulo 5: Implantação e Logística">Módulo 5: Implantação e Logística</option>
                  <option value="Módulo 6: Liderança e Discipulado">Módulo 6: Liderança e Discipulado</option>
                  <option value="Módulo 7: Projeto Final">Módulo 7: Projeto Final</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-bold mb-2">Link do Arquivo (PDF / Documento) *</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Ex: https://google-drive.com/seu-pdf.pdf"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none font-medium"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Coloque o link direto para download do material.</p>
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-bold mb-2">Descrição Curta *</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Breve descrição explicando do que se trata o material de apoio..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none font-medium"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-mission-orange hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Salvar Material
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-mission-orange animate-spin mb-3" />
            <p className="text-slate-500 font-medium text-sm">Carregando materiais...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {materials.map((material) => (
              <div
                key={material.id}
                className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between bg-slate-50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-slate-900 text-base">{material.title}</h4>
                    <span className="bg-orange-100 text-mission-orange text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                      {material.module.split(':')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{material.desc}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-3 truncate">{material.link}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => handleStartEdit(material)}
                    className="text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="text-red-600 hover:text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </div>
            ))}

            {materials.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
                Nenhum material de apoio cadastrado ainda.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
