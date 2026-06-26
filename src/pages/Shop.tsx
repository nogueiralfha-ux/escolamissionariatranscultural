import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Book, Shirt, PlaySquare, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const iconsMap: Record<string, any> = {
  Book: Book,
  Shirt: Shirt,
  PlaySquare: PlaySquare,
};

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

export function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const price = data.price || '';
        const cleanedPrice = price.replace(/[^\d,.]/g, '').replace(',', '.');
        const numericPrice = data.numericPrice !== undefined ? data.numericPrice : (parseFloat(cleanedPrice) || 0);

        prods.push({
          id: doc.id,
          title: data.title || data.name || 'Produto',
          type: data.type || data.tag || 'Literatura',
          price: price,
          numericPrice: numericPrice,
          image: data.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80',
          iconName: data.iconName || (data.tag?.toLowerCase().includes('camiseta') ? 'Shirt' : 'Book'),
          billingType: data.billingType || 'fixed',
          priceAnnual: data.priceAnnual,
          numericPriceAnnual: data.numericPriceAnnual
        } as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative">
      {/* Header */}
      <div className="bg-slate-900 py-16 text-center border-b-4 border-mission-orange">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-mission-orange/20 text-mission-orange-light px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
            <ShoppingBag className="w-5 h-5 fill-current" /> Vestuário e Literatura
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Loja Missionária</h1>
          <p className="text-xl text-slate-300">
            Adquira materiais exclusivos. Todo lucro é revertido para o impulsionamento de nossos projetos no campo estrutural.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-mission-orange" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => {
              const IconComponent = iconsMap[product.iconName] || Book;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 group flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                     <img 
                       src={product.image} 
                       alt={product.title}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80'; // Fallback
                       }}
                     />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5 shadow-sm">
                       <IconComponent className="w-4 h-4" /> {product.type}
                     </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{product.title}</h3>
                    <div className="text-2xl font-black text-slate-900 mb-6 mt-1">
                      {product.price}
                      {product.billingType === 'monthly' && <span className="text-sm font-medium text-slate-500 ml-1">/ mês</span>}
                      {product.billingType === 'yearly' && <span className="text-sm font-medium text-slate-500 ml-1">/ ano</span>}
                      {product.billingType === 'subscription' && <span className="text-sm font-medium text-slate-500 ml-1">/ mês</span>}
                    </div>
                    <button onClick={() => navigate(`/checkout?product=${product.id}`)} className="mt-auto w-full bg-slate-100 hover:bg-mission-orange hover:text-white text-slate-900 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <ShoppingBag className="w-5 h-5" /> Adicionar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
