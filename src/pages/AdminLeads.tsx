import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Loader2, Search, Download, Users, Mail, Phone, Calendar, BookOpen } from 'lucide-react';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  resourceTitle: string;
  createdAt: any;
}

export function AdminLeads() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: LeadItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          resourceTitle: data.resourceTitle || 'Recurso Desconhecido',
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      setLeads(list);
    } catch (err) {
      console.error("Erro ao buscar leads de download:", err);
      // Fallback em caso de erro de ordenação caso não tenha índice ainda
      try {
        const querySnapshot = await getDocs(collection(db, 'leads'));
        const list: LeadItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            resourceTitle: data.resourceTitle || 'Recurso Desconhecido',
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
          });
        });
        list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setLeads(list);
      } catch (fallbackErr) {
        console.error("Erro no fallback de busca de leads:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    // Header
    let csvContent = "data:text/csv;charset=utf-8,Nome,Email,WhatsApp,Material Baixado,Data de Cadastro\n";
    
    // Rows
    leads.forEach((lead) => {
      const formattedDate = lead.createdAt.toLocaleDateString('pt-BR') + " " + lead.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const row = `"${lead.name}","${lead.email}","${lead.phone}","${lead.resourceTitle}","${formattedDate}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_downloads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((lead) => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.resourceTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-mission-orange" />
            Contatos Capturados (Leads de Downloads)
          </h3>
          <p className="text-slate-500 text-xs mt-1">Lista de pessoas que baixaram materiais gratuitos no seu site.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={leads.length === 0}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Exportar Planilha (CSV)
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-950 focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none font-medium"
          />
        </div>
        <div className="text-slate-500 text-xs font-semibold">
          Total: {filteredLeads.length} de {leads.length} contatos
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-mission-orange animate-spin mb-3" />
          <p className="text-slate-500 font-medium text-sm">Carregando contatos...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Nome Completo</th>
                <th className="px-6 py-4">Contato (E-mail / WhatsApp)</th>
                <th className="px-6 py-4">Material Baixado</th>
                <th className="px-6 py-4">Data do Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeads.map((lead) => {
                const formattedDate = lead.createdAt.toLocaleDateString('pt-BR') + " " + lead.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <BookOpen className="w-4 h-4 text-mission-orange shrink-0" />
                        <span className="line-clamp-1">{lead.resourceTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Nenhum contato encontrado ou registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
