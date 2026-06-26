import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Save, X, BookOpen, AlertCircle, Loader2, Link as LinkIcon } from 'lucide-react';

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

const DEFAULT_RESOURCES: Omit<ResourceItem, 'id'>[] = [
  {
    title: "Como saber se Deus está te chamando?",
    type: "E-book Exclusivo",
    category: "E-books e Literatura",
    image: "https://i.ibb.co/0RkqSPbP/Chat-GPT-Image-18-de-mai-de-2026-13-09-13.png",
    description: "Um guia prático para entender os sinais e a voz de Deus para o seu chamado transcultural.",
    actionText: "Baixar Grátis",
    link: "https://ameimissoes.online/wp-content/uploads/2026/05/como-saber-se-Deus-esta-te-chamando.pdf", // Mock link
    order: 0
  },
  {
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
    title: "Atlas de Povos Não Alcançados",
    type: "Web App",
    category: "Aplicativos e Ferramentas",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80",
    description: "Mapeamento em tempo real de etnias e grupos minoritários para oração e envio.",
    actionText: "Acessar Plataforma",
    link: "/atlas",
    order: 3
  }
];

export function AdminResources() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [storeProducts, setStoreProducts] = useState<{ id: string; title: string; price: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('E-books e Literatura');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [actionText, setActionText] = useState('Baixar Grátis');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'resources'));
      const resourcesData: ResourceItem[] = [];
      querySnapshot.forEach((doc) => {
        resourcesData.push({ id: doc.id, ...doc.data() } as ResourceItem);
      });

      // Fetch products to link with
      try {
        const prodSnapshot = await getDocs(collection(db, 'products'));
        const prodsList: any[] = [];
        prodSnapshot.forEach((doc) => {
          const data = doc.data();
          prodsList.push({
            id: doc.id,
            title: data.title || data.name || 'Produto',
            price: data.price || 'R$ 0,00'
          });
        });
        setStoreProducts(prodsList);
      } catch (prodErr) {
        console.error("Erro ao carregar produtos na gestão de recursos", prodErr);
      }

      // Seed if empty
      if (resourcesData.length === 0) {
        console.log("Seeding default resources...");
        for (let i = 0; i < DEFAULT_RESOURCES.length; i++) {
          const newId = `resource_${i}`;
          await setDoc(doc(db, 'resources', newId), DEFAULT_RESOURCES[i]);
          resourcesData.push({ id: newId, ...DEFAULT_RESOURCES[i] });
        }
      }

      resourcesData.sort((a, b) => a.order - b.order);
      setResources(resourcesData);
    } catch (err: any) {
      console.error("Erro ao buscar recursos", err);
      setError("Falha ao carregar recursos do Firestore: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleEditClick = (res: ResourceItem) => {
    setIsEditing(res.id);
    setTitle(res.title);
    setType(res.type);
    setCategory(res.category);
    setImage(res.image);
    setDescription(res.description);
    setActionText(res.actionText);
    setLink(res.link);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(null);
    setTitle('');
    setType('E-book Grátis');
    setCategory('E-books e Literatura');
    setImage('https://i.ibb.co/0RkqSPbP/Chat-GPT-Image-18-de-mai-de-2026-13-09-13.png');
    setDescription('');
    setActionText('Baixar Grátis');
    setLink('');
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setError('');
  };

  const handleSave = async (id?: string) => {
    if (!title || !description || !link) {
      setError("Título, Descrição e Link/Arquivo são obrigatórios.");
      return;
    }

    setSaving(true);
    setError('');

    try {
      const targetId = id || `resource_${Date.now()}`;
      const docData = {
        title,
        type,
        category,
        image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80',
        description,
        actionText,
        link,
        order: id ? (resources.find(r => r.id === id)?.order ?? resources.length) : resources.length
      };

      await setDoc(doc(db, 'resources', targetId), docData);
      setIsEditing(null);
      setIsAdding(false);
      fetchResources();
    } catch (err: any) {
      console.error(err);
      setError("Erro ao salvar recurso no Firestore: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este recurso?")) {
      try {
        await deleteDoc(doc(db, 'resources', id));
        fetchResources();
      } catch (err: any) {
        console.error(err);
        setError("Erro ao excluir recurso: " + (err.message || String(err)));
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
          <h3 className="text-lg font-bold text-slate-900">Gestão de Recursos, E-books e Novidades</h3>
          <p className="text-sm text-slate-500">Cadastre e gerencie os e-books para download, manuais, aplicativos recomendados e notícias.</p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={handleAddClick}
            className="bg-mission-orange hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" /> Novo Recurso / Novidade
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
            {isAdding ? "Adicionar Novo Recurso / E-book / Novidade" : "Editar Recurso"}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Título do Recurso</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Como entender o chamado de Deus"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Categoria</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              >
                <option value="E-books e Literatura">E-books e Literatura</option>
                <option value="Aplicativos e Ferramentas">Aplicativos e Ferramentas</option>
                <option value="Novidades e Comunicações">Novidades e Comunicações</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Rótulo / Tipo</label>
              <input 
                type="text" 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                placeholder="Ex: E-book Grátis, Notícia, Manual"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Texto do Botão de Ação</label>
              <input 
                type="text" 
                value={actionText} 
                onChange={(e) => setActionText(e.target.value)}
                placeholder="Ex: Baixar Grátis, Ler Notícia, Acessar"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Vincular a um Produto da Loja (Opcional)</label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    setLink(`/checkout?product=${val}`);
                    setActionText('Adquirir');
                  }
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm bg-white"
                value={link.startsWith('/checkout?product=') ? link.replace('/checkout?product=', '') : ''}
              >
                <option value="">-- Selecione um produto da loja para compras --</option>
                {storeProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.price})</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">Selecione um produto cadastrado na sua loja para preencher o link de checkout e botão de compra automaticamente.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Link de Acesso (URL externa, arquivo PDF ou link de checkout)</label>
              <input 
                type="text" 
                value={link} 
                onChange={(e) => setLink(e.target.value)}
                placeholder="Ex: https://google-drive.com/seu-pdf.pdf ou /atlas"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Link da Imagem de Capa (i.ibb.co/...)</label>
              <input 
                type="text" 
                value={image} 
                onChange={(e) => setImage(e.target.value)}
                placeholder="Ex: https://i.ibb.co/ZpxQCNK7/image.png"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Descrição / Resumo</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Um pequeno parágrafo explicando do que se trata este material..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-mission-orange outline-none text-sm"
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
              {saving ? "Salvando..." : "Salvar Recurso"}
            </button>
          </div>
        </div>
      )}

      {/* Resources List */}
      <div className="grid grid-cols-1 gap-4">
        {resources.map((res) => (
          <div key={res.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                <img src={res.image} alt={res.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase">
                    {res.category}
                  </span>
                  <span className="text-xs text-mission-orange font-bold uppercase">
                    {res.type}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-1">{res.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">{res.description}</p>
                <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2">
                  <LinkIcon className="w-3.5 h-3.5" /> Ver Link / Destino: {res.link.substring(0, 50)}...
                </a>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
              <button 
                onClick={() => handleEditClick(res)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(res.id)}
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
