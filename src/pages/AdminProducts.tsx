import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Plus, Trash2, Loader2, Database, Pencil, X } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    title: "Livro: A História das Missões",
    type: "Livro Físico",
    price: "R$ 49,90",
    numericPrice: 49.90,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80",
    iconName: "Book",
  },
  {
    title: "E-book: Introdução à Missiologia",
    type: "Digital",
    price: "R$ 29,90",
    numericPrice: 29.90,
    image: "https://i.ibb.co/0RkqSPbP/Chat-GPT-Image-18-de-mai-de-2026-13-09-13.png",
    iconName: "PlaySquare",
  },
  {
    title: "E-book: 365 Histórias Missionárias",
    type: "Digital",
    price: "R$ 27,90",
    numericPrice: 27.90,
    image: "https://i.ibb.co/4nM58MCc/historias-missionarias.png",
    iconName: "PlaySquare",
  },
  {
    title: "Apostila Completa do Aluno",
    type: "Material Didático",
    price: "R$ 196,00",
    numericPrice: 196.00,
    image: "https://i.ibb.co/9H2YhWNs/apostila-completa-do-aluno.png",
    iconName: "Book",
  },
  {
    title: "Camiseta Preta Masculina/Feminina",
    type: "Vestuário",
    price: "R$ 69,00",
    numericPrice: 69.00,
    image: "https://i.ibb.co/1tNt75cm/camisetas-da-escolas.png",
    iconName: "Shirt",
  },
  {
    title: "Camiseta Feminina Rosa",
    type: "Vestuário",
    price: "R$ 69,00",
    numericPrice: 69.00,
    image: "https://i.ibb.co/Mx7cMz1h/camisetas-escola-rosa.png",
    iconName: "Shirt",
  },
  {
    title: "Camiseta Rosa Modelo 2",
    type: "Vestuário",
    price: "R$ 69,00",
    numericPrice: 69.00,
    image: "https://i.ibb.co/ZRFvqHKd/camiseta-escola-rosa-modelo-2.png",
    iconName: "Shirt",
  },
  {
    title: "Camiseta Oficial do Treinamento",
    type: "Vestuário",
    price: "R$ 89,00",
    numericPrice: 89.00,
    image: "https://i.ibb.co/fY9pfMhM/camiseta-escola-cor-preta-modelo-2.png",
    iconName: "Shirt",
  },
  {
    title: "Camiseta Oficial do Treinamento (Feminina Rosa)",
    type: "Vestuário",
    price: "R$ 89,00",
    numericPrice: 89.00,
    image: "https://i.ibb.co/JjHYJhLs/camiseta-odicial-do-treinamento-cor-rosa.png",
    iconName: "Shirt",
  },
];

interface Product {
  id: string;
  title: string;
  type: string;
  price: string;
  numericPrice: number;
  image: string;
  iconName: string;
  billingType?: 'fixed' | 'monthly' | 'yearly' | 'subscription';
  priceAnnual?: string;
  numericPriceAnnual?: number;
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Digital');
  const [newPrice, setNewPrice] = useState('');
  const [newNumericPrice, setNewNumericPrice] = useState('');
  const [newPriceAnnual, setNewPriceAnnual] = useState('');
  const [newNumericPriceAnnual, setNewNumericPriceAnnual] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newIconName, setNewIconName] = useState('Book');
  const [newBillingType, setNewBillingType] = useState<'fixed' | 'monthly' | 'yearly' | 'subscription'>('fixed');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setNewTitle(product.title);
    setNewType(product.type || 'Digital');
    setNewPrice(product.price);
    setNewNumericPrice(product.numericPrice?.toString() || '');
    setNewPriceAnnual(product.priceAnnual || '');
    setNewNumericPriceAnnual(product.numericPriceAnnual?.toString() || '');
    setNewImage(product.image);
    setNewIconName(product.iconName || 'Book');
    setNewBillingType(product.billingType || 'fixed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewTitle('');
    setNewType('Digital');
    setNewPrice('');
    setNewNumericPrice('');
    setNewPriceAnnual('');
    setNewNumericPriceAnnual('');
    setNewImage('');
    setNewIconName('Book');
    setNewBillingType('fixed');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newNumericPrice || !newImage) {
      showStatus("Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    if (newImage.includes('ibb.co/') && !newImage.includes('i.ibb.co/')) {
      showStatus("Por favor, use o 'Link Direto' do ImgBB. O link deve começar com i.ibb.co.", "error");
      return;
    }
    
    setIsAdding(true);
    try {
      const parsedNumericPrice = parseFloat(newNumericPrice.replace(',', '.')) || 0;
      const productData: any = {
        title: newTitle,
        type: newType,
        price: newPrice,
        numericPrice: parsedNumericPrice,
        image: newImage,
        iconName: newIconName,
        billingType: newBillingType,
      };

      if (newBillingType === 'subscription') {
        productData.priceAnnual = newPriceAnnual;
        productData.numericPriceAnnual = parseFloat(newNumericPriceAnnual.replace(',', '.')) || 0;
      }

      if (editingProductId) {
        await updateDoc(doc(db, 'products', editingProductId), productData);
        showStatus("Produto atualizado com sucesso!", "success");
      } else {
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
        showStatus("Produto adicionado com sucesso!", "success");
      }
      
      handleCancelEdit();
    } catch (error) {
      console.error("Error saving product", error);
      showStatus("Erro ao salvar produto.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSeedProducts = async () => {
    setIsAdding(true);
    try {
      const batch = writeBatch(db);
      MOCK_PRODUCTS.forEach((product) => {
        const docRef = doc(collection(db, 'products'));
        batch.set(docRef, {
          ...product,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
      showStatus("Produtos adicionados com sucesso!", "success");
    } catch (error) {
      console.error("Error seeding products", error);
      showStatus("Erro ao popular produtos.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      showStatus("Produto deletado com sucesso!", "success");
    } catch (error) {
      console.error("Error deleting product", error);
      showStatus("Erro ao deletar produto.", "error");
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-mission-orange" /></div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Gestão de Produtos</h3>
      
      {statusMessage.text && (
        <div className={`mb-6 p-4 rounded-xl border font-medium text-sm flex items-center gap-2 ${
          statusMessage.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-mission-green/10 border-mission-green/20 text-mission-green'
        }`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSaveProduct} className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            {editingProductId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
            {editingProductId ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h4>
          {editingProductId && (
            <button type="button" onClick={handleCancelEdit} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
              <X className="w-4 h-4" /> Cancelar
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Título</label>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm" placeholder="Ex: Livro Físico..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
            <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm">
              <option value="Digital">Digital</option>
              <option value="Livro Físico">Livro Físico</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Material Didático">Material Didático</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Preço (Exibição)</label>
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm" placeholder="Ex: R$ 49,90" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Preço Numérico</label>
            <input type="text" value={newNumericPrice} onChange={e => setNewNumericPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm" placeholder="Ex: 49.90 ou 49,90" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de Cobrança</label>
            <select value={newBillingType} onChange={e => setNewBillingType(e.target.value as any)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm">
              <option value="fixed">Pagamento Único</option>
              <option value="monthly">Assinatura (Apenas Mensal)</option>
              <option value="yearly">Assinatura (Apenas Anual)</option>
              <option value="subscription">Assinatura (Mensal e Anual)</option>
            </select>
          </div>

          {newBillingType === 'subscription' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Preço Anual (Exibição)</label>
                <input value={newPriceAnnual} onChange={e => setNewPriceAnnual(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm" placeholder="Ex: R$ 490,00" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Preço Numérico Anual</label>
                <input type="text" value={newNumericPriceAnnual} onChange={e => setNewNumericPriceAnnual(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm" placeholder="Ex: 490.00 ou 490,00" />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">URL da Imagem</label>
            <input value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mission-orange outline-none text-sm" placeholder="Ex: https://i.ibb.co/.../imagem.png" />
            <p className="text-[10px] text-slate-500 mt-1">
              Atenção: O link precisa terminar com a extensão da imagem (como <span className="font-semibold text-slate-700">.png</span>, <span className="font-semibold text-slate-700">.jpg</span>, <span className="font-semibold text-slate-700">.webp</span>). Se estiver usando o <b>ImgBB</b>, não copie o link do navegador, copie o <span className="font-semibold text-slate-700 text-mission-orange">Link Direto (Direct link)</span>.
            </p>
          </div>
        </div>
        <button type="submit" disabled={isAdding} className="bg-mission-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingProductId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
          {editingProductId ? 'Salvar Alterações' : 'Adicionar'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className={`border ${editingProductId === product.id ? 'border-mission-orange ring-2 ring-mission-orange/20' : 'border-slate-200'} rounded-xl overflow-hidden flex flex-col group`}>
            <div className="aspect-video relative bg-slate-100 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h5 className="font-bold text-slate-900 mb-1 text-sm">{product.title}</h5>
              <p className="text-xs text-slate-500 mb-2">{product.type}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div>
                  <span className="font-bold text-mission-orange">{product.price}</span>
                  {product.billingType === 'monthly' && <span className="text-[10px] text-slate-400 ml-1">/mês</span>}
                  {product.billingType === 'yearly' && <span className="text-[10px] text-slate-400 ml-1">/ano</span>}
                  {product.billingType === 'subscription' && <div className="text-[10px] text-slate-400">Mensal/Anual</div>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditProduct(product)} className="text-slate-500 hover:text-mission-orange hover:bg-orange-50 p-2 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center justify-center">
            <p className="mb-4">Nenhum produto cadastrado.</p>
            <button 
              onClick={handleSeedProducts}
              disabled={isAdding}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Popular Produtos Iniciais
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

