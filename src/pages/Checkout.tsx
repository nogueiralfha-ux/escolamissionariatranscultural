import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, CreditCard, ShieldCheck, Loader2, CheckCircle2, QrCode, FileText, ArrowLeft } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { useAuth } from '../contexts/AuthContext';

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

export function Checkout() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('product');

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'monthly' | 'annual'>('monthly');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    if (user?.email) setEmail(user.email);
  }, [user, profile]);
  
  // Card states
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Response details from Asaas
  const [pixCopyPaste, setPixCopyPaste] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [bankSlipUrl, setBankSlipUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(productsData);

        if (productId) {
          const foundProduct = productsData.find(p => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
          } else if (productsData.length > 0) {
            setProduct(productsData[0]);
          }
        } else if (productsData.length > 0) {
          setProduct(productsData[0]);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [productId]);

  const processCustomPayment = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const numericPriceValue = (product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly') && subscriptionPlan === 'annual' && product.numericPriceAnnual 
        ? product.numericPriceAnnual 
        : product.numericPrice;

      const body: any = {
        productName: product.title,
        productType: (product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly') ? 'subscription' : 'one_time',
        amount: numericPriceValue.toString(),
        billingType: subscriptionPlan,
        paymentMethod: paymentMethod === 'credit_card' ? 'card' : paymentMethod,
        name,
        email,
        phone,
        cpfCnpj
      };

      if (paymentMethod === 'credit_card') {
        const [expiryMonth, expiryYear] = cardExpiry.split('/');
        body.creditCard = {
          holderName: cardHolder,
          number: cardNumber.replace(/\s/g, ''),
          expiryMonth: expiryMonth || '',
          expiryYear: expiryYear ? `20${expiryYear}` : '',
          cvv: cardCvv
        };
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }

      if (data.success) {
        if (data.pixCopyPaste) setPixCopyPaste(data.pixCopyPaste);
        if (data.pixQrCode) setPixQrCode(data.pixQrCode);
        if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
        if (data.bankSlipUrl) setBankSlipUrl(data.bankSlipUrl);
        setCheckoutSuccess(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Falha ao processar checkout. Verifique os dados inseridos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-mission-orange" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Produto não encontrado</h2>
        <button onClick={() => navigate('/loja')} className="bg-mission-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          Voltar para a Loja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-200"
        >
          {checkoutSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-mission-green/10 text-mission-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Aguardando Pagamento!</h2>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 max-w-md mx-auto text-left space-y-4">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Resumo da Cobrança</h4>
                <p className="text-sm text-slate-700"><strong>Produto:</strong> {product.title}</p>
                <p className="text-sm text-slate-700"><strong>Plano:</strong> {product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly' ? (subscriptionPlan === 'annual' ? 'Anual' : 'Mensal') : 'Pagamento Único'}</p>

                {pixQrCode && (
                  <div className="flex flex-col items-center justify-center pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Escaneie o QR Code Pix</p>
                    <img src={pixQrCode} alt="PIX QR Code" className="w-48 h-48 border border-slate-200 rounded-lg p-1 bg-white mb-4" />
                    
                    <p className="text-xs text-slate-500 mb-2 w-full text-center">Ou copie o código copia e cola abaixo:</p>
                    <textarea 
                      readOnly 
                      value={pixCopyPaste} 
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      className="w-full h-20 text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 resize-none outline-none focus:border-mission-orange"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Dica: Clique dentro da caixa para selecionar e copiar o código Pix.</p>
                  </div>
                )}

                {bankSlipUrl && (
                  <div className="pt-4 border-t border-slate-200 text-center">
                    <a 
                      href={bankSlipUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-mission-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md text-sm"
                    >
                      <FileText className="w-5 h-5" /> Imprimir / Baixar Boleto Bancário
                    </a>
                  </div>
                )}

                {invoiceUrl && (
                  <div className="pt-4 border-t border-slate-200 text-center">
                    <a 
                      href={invoiceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-[#8C6D31] font-bold hover:underline"
                    >
                      Visualizar Fatura Completa no Asaas
                    </a>
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/loja')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-colors text-sm"
              >
                Voltar para a Loja
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => navigate('/loja')}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Finalizar Pedido</h2>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Produto Selecionado</label>
                  <select 
                    value={product.id}
                    onChange={(e) => {
                      const selected = products.find(p => p.id === e.target.value);
                      if (selected) setProduct(selected);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all font-semibold"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 items-center border-t border-slate-200 pt-4 mt-2">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{product.title}</h3>
                    <p className="text-sm text-slate-500">{product.type}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-xl font-black text-slate-900">
                      {(product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly') && subscriptionPlan === 'annual' && product.priceAnnual ? product.priceAnnual : product.price}
                    </div>
                    {(product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly') && (
                      <div className="text-xs text-slate-500 font-medium">
                        {subscriptionPlan === 'monthly' ? '/ mês' : '/ ano'}
                      </div>
                    )}
                  </div>
                </div>

                {(product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly') && (
                  <div className="border-t border-slate-200 pt-4 mt-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Plano</label>
                    <select 
                      value={subscriptionPlan}
                      onChange={(e) => setSubscriptionPlan(e.target.value as 'monthly' | 'annual')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all font-semibold"
                    >
                      <option value="monthly">Mensal - {product.price}</option>
                      {product.priceAnnual && <option value="annual">Anual - {product.priceAnnual}</option>}
                    </select>
                  </div>
                )}
              </div>
              <form onSubmit={processCustomPayment} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                    <input 
                      required 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" 
                      placeholder="Seu nome completo" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
                      <input 
                        required 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" 
                        placeholder="seu@email.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp</label>
                      <input 
                        required 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" 
                        placeholder="16997327255" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CPF ou CNPJ</label>
                    <input 
                      required 
                      type="text" 
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" 
                      placeholder="000.000.000-00" 
                    />
                  </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'credit_card' ? 'bg-white shadow-sm text-slate-900 leading-none' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <CreditCard className="w-4 h-4" /> Cartão
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'pix' ? 'bg-white shadow-sm text-slate-900 leading-none' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <QrCode className="w-4 h-4" /> Pix
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'boleto' ? 'bg-white shadow-sm text-slate-900 leading-none' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <FileText className="w-4 h-4" /> Boleto
                  </button>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Impresso no Cartão</label>
                      <input 
                        required 
                        type="text" 
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all" 
                        placeholder="NOME IMPRESSO" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Número do Cartão</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input 
                          required 
                          type="text" 
                          maxLength={19} 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all font-mono" 
                          placeholder="0000 0000 0000 0000" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Validade</label>
                        <input 
                          required 
                          type="text" 
                          maxLength={5} 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all font-mono" 
                          placeholder="MM/AA" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">CVC</label>
                        <input 
                          required 
                          type="text" 
                          maxLength={4} 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-mission-orange focus:ring-2 focus:ring-mission-orange/20 outline-none transition-all font-mono" 
                          placeholder="123" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center animate-in fade-in slide-in-from-bottom-2">
                    <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-900 mb-2">Pagamento via Pix</h4>
                    <p className="text-sm text-slate-500 mb-4">O código Pix Copia e Cola e o QR Code serão gerados em tempo real na próxima tela.</p>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center animate-in fade-in slide-in-from-bottom-2">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-900 mb-2">Pagamento via Boleto</h4>
                    <p className="text-sm text-slate-500 mb-4">O link para download do boleto será gerado e enviado para o seu e-mail.</p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-slate-900">Total a pagar:</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-mission-orange">
                        R$ {((product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly') && subscriptionPlan === 'annual' && product.numericPriceAnnual ? product.numericPriceAnnual : product.numericPrice).toFixed(2)}
                      </span>
                      {(product.billingType === 'subscription' || product.billingType === 'monthly' || product.billingType === 'yearly') && (
                        <div className="text-xs text-slate-500 font-medium">
                          {subscriptionPlan === 'monthly' ? '/ mês' : '/ ano'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-mission-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
                    ) : (
                      <><ShieldCheck className="w-5 h-5" /> Confirmar Pagamento</>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Pagamento 100% seguro pelo Asaas
                  </p>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
