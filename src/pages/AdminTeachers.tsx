import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Save, X, Users, AlertCircle, Loader2 } from 'lucide-react';

interface TeacherItem {
  id: string;
  name: string;
  subject: string;
  bio: string;
  image: string;
  order: number;
}

const DEFAULT_TEACHERS: Omit<TeacherItem, 'id'>[] = [
  {
    name: "Pr. Alexandre Nogueira",
    subject: "Teologia Missiológica & Plantação de Igrejas",
    bio: "Mais de 15 anos de experiência prática e pastoral em campos nacionais e transculturais. Fundador e coordenador da Escola Missionária.",
    image: "https://i.ibb.co/8Lq8yfn6/logo-para-facebook.png",
    order: 0
  },
  {
    name: "Prof. Marcos Souza",
    subject: "Inteligência Cultural & Antropologia",
    bio: "Doutor em Ciências da Religião, com foco em comunicação transcultural e análise de cosmovisões de povos minoritários.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    order: 1
  }
];

export function AdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teachersData: TeacherItem[] = [];
      querySnapshot.forEach((doc) => {
        teachersData.push({ id: doc.id, ...doc.data() } as TeacherItem);
      });

      // Seed if empty
      if (teachersData.length === 0) {
        console.log("Seeding default teachers...");
        for (let i = 0; i < DEFAULT_TEACHERS.length; i++) {
          const newId = `teacher_${i}`;
          await setDoc(doc(db, 'teachers', newId), DEFAULT_TEACHERS[i]);
          teachersData.push({ id: newId, ...DEFAULT_TEACHERS[i] });
        }
      }

      teachersData.sort((a, b) => a.order - b.order);
      setTeachers(teachersData);
    } catch (err: any) {
      console.error("Erro ao buscar professores", err);
      setError('Erro ao carregar a lista de professores do Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleStartAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setName('');
    setSubject('');
    setBio('');
    setImage('');
    setError('');
  };

  const handleStartEdit = (teacher: TeacherItem) => {
    setIsEditing(teacher.id);
    setIsAdding(false);
    setName(teacher.name);
    setSubject(teacher.subject);
    setBio(teacher.bio);
    setImage(teacher.image);
    setError('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !bio || !image) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const isNew = isAdding;
      const targetId = isNew ? `teacher_${Date.now()}` : (isEditing as string);
      
      const teacherData = {
        name,
        subject,
        bio,
        image,
        order: isNew ? teachers.length : (teachers.find(t => t.id === targetId)?.order ?? 0)
      };

      await setDoc(doc(db, 'teachers', targetId), teacherData);
      
      setIsAdding(false);
      setIsEditing(null);
      await fetchTeachers();
    } catch (err: any) {
      console.error("Erro ao salvar professor", err);
      setError('Erro ao salvar as informações no Firestore. Verifique suas regras ou conexão.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este professor?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'teachers', id));
      await fetchTeachers();
    } catch (err: any) {
      console.error("Erro ao excluir professor", err);
      setError('Erro ao remover o professor do Firestore.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-mission-orange" />
            Gestão do Corpo Docente (Professores)
          </h3>
          <p className="text-slate-500 text-xs mt-1">Configure os professores exibidos na página "Quem Somos".</p>
        </div>
        {!isAdding && !isEditing && (
          <button
            onClick={handleStartAdd}
            className="bg-mission-orange hover:bg-orange-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Professor
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
              {isAdding ? 'Adicionar Novo Professor' : 'Editar Informações do Professor'}
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Pr. Alexandre Nogueira"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2">Matéria / Disciplina *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Teologia Missiológica, Antropologia..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-bold mb-2">Foto (URL da Imagem) *</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Ex: https://images.unsplash.com/... ou https://i.ibb.co/..."
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Insira uma URL pública da foto do professor.</p>
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-bold mb-2">Histórico / Biografia Breve *</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Uma breve apresentação do histórico missionário, acadêmico e teológico do docente."
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-mission-orange hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Salvar Professor
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
            <p className="text-slate-500 font-medium text-sm">Carregando professores...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-5 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-4 items-start bg-slate-50 hover:shadow-md transition-shadow relative"
              >
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200 bg-white"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-base">{teacher.name}</h4>
                  <p className="text-xs font-semibold text-mission-orange uppercase tracking-wider mt-0.5">{teacher.subject}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{teacher.bio}</p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleStartEdit(teacher)}
                      className="text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="text-red-600 hover:text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {teachers.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
                Nenhum professor cadastrado ainda.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
