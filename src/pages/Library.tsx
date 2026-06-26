import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Send, Bot, User, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function Library() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o Assistente da Biblioteca Digital. Posso te ajudar a encontrar recursos, realizar pesquisas sobre missões, história cristã ou teologia transcultural. O que você gostaria de pesquisar hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error('Falha ao conectar com o servidor');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Verifique se o servidor está rodando ou tente novamente mais tarde.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 flex flex-col">
      <div className="bg-slate-900 py-10 text-center border-b-4 border-mission-orange">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-mission-orange/20 text-mission-orange-light px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-4">
            <BookOpen className="w-5 h-5" /> Inteligência Missiológica
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Biblioteca Digital IA</h1>
          <p className="text-lg text-slate-300">
            Pesquise sobre histórico de missões, teologia e povos alcançados com nossa inteligência artificial.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 flex-1 flex flex-col overflow-hidden h-[600px] max-h-[70vh]">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={index} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-mission-orange text-white' : 'bg-slate-900 text-white'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-mission-orange/10 text-slate-900 rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                   <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input or Back Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            {messages.length > 1 ? (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setMessages([{
                      role: 'assistant',
                      content: 'Olá! Sou o Assistente da Biblioteca Digital. Posso te ajudar a encontrar recursos, realizar pesquisas sobre missões, história cristã ou teologia transcultural. O que você gostaria de pesquisar hoje?'
                    }]);
                    setInput('');
                  }}
                  disabled={isLoading}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-md flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Pesquisando recursos...
                    </>
                  ) : (
                    <>Terminei de ler (Voltar para pesquisa)</>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pesquise sobre teologia, povos não alcançados, história cristã..."
                  disabled={isLoading}
                  className="w-full pl-6 pr-16 py-4 rounded-full border-2 border-slate-200 focus:border-mission-orange outline-none transition-colors bg-white font-medium disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 p-2.5 bg-mission-orange hover:bg-mission-orange-light text-white rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
