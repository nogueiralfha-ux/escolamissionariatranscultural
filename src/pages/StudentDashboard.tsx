import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, FileText, CheckCircle2, Calendar, Trophy, BadgeAlert, GraduationCap, Download, PieChart, Users, X, Printer, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

function getModuleHours(title: string) {
  if (title.includes("Módulo 1")) return "120";
  if (title.includes("Módulo 2")) return "150";
  if (title.includes("Módulo 3")) return "180";
  if (title.includes("Módulo 4")) return "120";
  if (title.includes("Módulo 5")) return "150";
  if (title.includes("Módulo 6")) return "120";
  if (title.includes("Módulo 7") || title.includes("Projeto Final")) return "200";
  return "120";
}

export function StudentDashboard() {
  const [showCertificate, setShowCertificate] = useState(false);
  const { user, profile, signOut, toggleSubscriptionStatus } = useAuth();
  const [studentName, setStudentName] = useState(profile?.name || "João Silva");
  const [moduleName, setModuleName] = useState("Módulo 1: Fundamentos Bíblicos");
  const [certificateHours, setCertificateHours] = useState("120");
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('pt-BR'));

  const [modules, setModules] = useState<any[]>([
    { id: '1', title: "Módulo 1: Fundamentos Bíblicos", topics: ["1", "2", "3", "4"] },
    { id: '2', title: "Módulo 2: Identidade Missionária", topics: ["1", "2", "3", "4", "5"] },
    { id: '3', title: "Módulo 3: Evangelismo Transcultural", topics: ["1", "2", "3", "4", "5", "6"] },
    { id: '4', title: "Módulo 4: Batalha Espiritual", topics: ["1", "2", "3", "4"] },
    { id: '5', title: "Módulo 5: Implantação e Logística", topics: ["1", "2", "3", "4", "5"] },
    { id: '6', title: "Módulo 6: Liderança e Discipulado", topics: ["1", "2", "3", "4"] },
    { id: '7', title: "Módulo 7: Projeto Final", topics: ["1", "2", "3", "4"] },
  ]);

  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const loadMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'student_materials'));
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      list.sort((a, b) => a.order - b.order);
      setMaterials(list);
    } catch (err) {
      console.error("Erro ao carregar materiais de apoio:", err);
    } finally {
      setLoadingMaterials(false);
    }
  };

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
        }
      } catch (err) {
        console.error("Erro ao carregar grade no dashboard, usando fallback:", err);
      }
    }
    loadCurriculum();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      
      {/* Dashboard Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white overflow-hidden border-4 border-white shadow-md p-1">
              <img src="https://i.ibb.co/d4SnxmhJ/logo-2-escola-missionaria-trandcultural-removebg-preview-1.png" alt="Logo da Escola" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Olá, {profile?.name || 'Aluno'}</h1>
              <p className="text-slate-500">Turma 2026 • Missões Transculturais</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-mission-gold/10 text-mission-gold px-4 py-2 rounded-lg font-medium border border-mission-gold/20">
                <Trophy className="w-5 h-5" />
                <span>Evangelista</span>
              </div>
              <div className="flex items-center gap-2 bg-mission-green/10 text-mission-green px-4 py-2 rounded-lg font-medium border border-mission-green/20">
                <GraduationCap className="w-5 h-5" />
                <span>32% Concluído</span>
              </div>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={toggleSubscriptionStatus} 
                className="text-xs flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                title="Essa ação altera seu cadastro do banco para bloquear acesso simulando falta de pagamento."
              >
                <ShieldAlert className="w-4 h-4" /> Simular Inadimplência
              </button>
              <button 
                onClick={signOut} 
                className="text-xs flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Watching */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Continuar de onde parou</h2>
            </div>
            
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex flex-col sm:flex-row group cursor-pointer hover:border-mission-orange/50 transition-colors">
              <div className="sm:w-1/3 relative bg-slate-800">
                 <img src="https://images.unsplash.com/photo-1506869640319-ce1c2471593e?auto=format&fit=crop&q=80" alt="Aula" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-10 h-10 text-white opacity-80 group-hover:scale-110 transition-transform" />
                 </div>
              </div>
              <div className="p-5 flex flex-col justify-center sm:w-2/3">
                <div className="text-xs font-bold text-mission-orange uppercase tracking-wider mb-1">Módulo 3 • Aula 2</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Povos Não Alcançados no Século 21</h3>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progresso da aula</span>
                    <span>14:20 / 45:00</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-mission-orange h-1.5 rounded-full" style={{ width: '31%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Modules Progress */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Meu Curso</h2>
            <div className="space-y-4">
              {modules.map((mod) => {
                const total = mod.topics ? mod.topics.length : 4;
                const watched = total;
                const hours = getModuleHours(mod.title);
                return (
                  <div key={mod.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center gap-4 hover:border-mission-orange/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-mission-green/20 text-mission-green flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">{mod.title}</h4>
                      <p className="text-xs text-slate-500">{watched} de {total} aulas concluídas • {hours}h de carga horária</p>
                    </div>
                    <button 
                      onClick={() => {
                        setModuleName(mod.title);
                        setCertificateHours(hours);
                        setShowCertificate(true);
                      }}
                      className="text-mission-green font-semibold text-xs md:text-sm flex items-center gap-1 hover:underline shrink-0 bg-white shadow-sm border border-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      <Download className="w-4 h-4"/> Certificado
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-mission-green/30 hover:bg-green-50 transition-colors gap-2 text-slate-700 hover:text-mission-green">
              <Calendar className="w-6 h-6" />
              <span className="text-sm font-medium">Agenda</span>
            </button>
            <button 
              onClick={() => {
                loadMaterials();
                setShowMaterialsModal(true);
              }}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-mission-orange/30 hover:bg-orange-50 transition-colors gap-2 text-slate-700 hover:text-mission-orange"
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm font-medium">Biblioteca PDF</span>
            </button>
             <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-mission-gold/30 hover:bg-yellow-50 transition-colors gap-2 text-slate-700 hover:text-mission-gold">
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Comunidade</span>
            </button>
             <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors gap-2 text-slate-700">
              <BadgeAlert className="w-6 h-6 text-red-500" />
              <span className="text-sm font-medium">Avisos (2)</span>
            </button>
          </div>

          {/* Gamification Badges */}
          <div className="bg-slate-950 p-6 rounded-2xl shadow-sm text-white">
            <h2 className="text-lg font-bold mb-4">Minhas Conquistas</h2>
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-square bg-slate-800 rounded-full flex items-center justify-center border border-mission-gold text-mission-gold group relative cursor-help">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="aspect-square bg-slate-800 rounded-full flex items-center justify-center border border-mission-green text-mission-green">
                <StarIcon className="w-6 h-6" />
              </div>
               <div className="aspect-square bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 text-slate-600 opacity-50 relative">
                <FlameIcon className="w-6 h-6" />
              </div>
               <div className="aspect-square bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 text-slate-600 opacity-50 relative">
                <ShieldIcon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">Desbloqueie concluindo módulos e engajando na comunidade.</p>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-900/50 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate preview */}
              <div className="relative w-full aspect-[1.414/1] bg-[#FAF8F5] p-8 md:p-12 flex flex-col justify-between text-center overflow-hidden border-[16px] border-[#D4AF37]" id="certificate-content">
                  {/* Subtle Elegant Borders & Background Pattern */}
                  <div className="absolute inset-4 border border-[#D4AF37]/50 pointer-events-none z-10"></div>
                  <div className="absolute inset-5 border-2 border-[#D4AF37]/20 pointer-events-none z-10"></div>
                  
                  {/* Watermark Crest Background */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <img 
                      src="/brasao.png" 
                      alt="Crest Watermark" 
                      className="w-[450px] h-[450px] object-contain"
                    />
                  </div>

                  {/* Header: Logo and Title */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src="/brasao.png" 
                        alt="Brasão Oficial" 
                        className="h-16 w-auto object-contain filter drop-shadow-sm" 
                      />
                    </div>
                    <p className="text-[#8C6D31] font-serif uppercase tracking-[0.25em] text-xs font-semibold mb-1">
                      República Federativa do Brasil
                    </p>
                    <h1 className="text-3xl md:text-4xl font-normal text-slate-900 uppercase tracking-widest font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                      Diplomas de Formação
                    </h1>
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-2"></div>
                    <p className="text-slate-600 uppercase tracking-[0.2em] text-[10px] font-bold">
                      Escola Missionária Transcultural
                    </p>
                  </div>

                  {/* Main Text Body */}
                  <div className="relative z-10 my-4 px-6 md:px-12 flex flex-col items-center justify-center w-full">
                    <p className="text-slate-500 font-serif italic text-base mb-3 w-full" style={{ fontFamily: 'Georgia, serif' }}>
                      Certificamos, para os devidos fins, que o discente
                    </p>
                    
                    <div className="mb-3 border-b border-[#D4AF37]/60 w-[550px] max-w-full pb-1 flex justify-center">
                      <input 
                        type="text" 
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="text-2xl md:text-3xl font-bold text-slate-800 bg-transparent text-center outline-none w-full font-serif"
                        style={{ fontFamily: 'Georgia, serif' }}
                      />
                    </div>

                    <p className="text-slate-500 font-serif italic text-sm mb-3 w-full" style={{ fontFamily: 'Georgia, serif' }}>
                      concluiu com êxito e aproveitamento exemplar as atividades pedagógicas do
                    </p>

                    <div className="mb-2 border-b border-[#D4AF37]/60 w-[450px] max-w-full pb-1 flex justify-center">
                      <input 
                        type="text" 
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
                        className="text-lg md:text-xl font-bold text-[#8C6D31] bg-transparent text-center outline-none w-full font-serif"
                        style={{ fontFamily: 'Georgia, serif' }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-xl mx-auto mt-2">
                      cumprindo integralmente a carga horária de <strong className="text-slate-600">{certificateHours} horas</strong> de capacitação teológica, desenvolvimento de caráter e treinamento de missões práticas transculturais da grade curricular oficial.
                    </p>
                  </div>

                  {/* Footer: Signatures and Stamp */}
                  <div className="relative z-10 flex justify-between items-end w-full px-6 md:px-12 mt-2">
                    <div className="text-center w-40">
                      <input 
                        type="text" 
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="text-slate-800 font-serif text-sm font-semibold bg-transparent text-center outline-none border-b border-slate-300 w-full pb-1"
                        style={{ fontFamily: 'Georgia, serif' }}
                      />
                      <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Data de Emissão</p>
                    </div>
                    
                    {/* Golden Stamp Seal */}
                    <div className="relative w-16 h-16 shrink-0 mx-4 flex items-center justify-center">
                      {/* Outer Golden Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37] animate-spin" style={{ animationDuration: '40s' }}></div>
                      {/* Solid Golden Circle */}
                      <div className="absolute inset-1.5 bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] rounded-full shadow-md flex items-center justify-center border border-[#AA7C11]/30">
                        <GraduationCap className="w-8 h-8 text-white filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                      </div>
                    </div>

                    <div className="text-center w-48 flex flex-col items-center">
                      {/* Stylized Fake Signature */}
                      <div className="h-8 flex items-center justify-center relative w-full">
                        <span className="font-serif italic text-blue-900/85 text-xl font-bold absolute -bottom-1" style={{ fontFamily: "'Clicker Script', 'Brush Script MT', 'Great Vibes', cursive", transform: 'rotate(-5deg)' }}>
                          Luiz Nogueira
                        </span>
                      </div>
                      <div className="border-b border-slate-300 w-full pb-1 mt-1"></div>
                      <p className="text-[9px] text-slate-700 font-bold mt-1 uppercase tracking-wider">Luiz Nogueira</p>
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider">Coordenação Geral</p>
                    </div>
                  </div>

              </div>

              {/* Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-sm text-slate-500 font-medium hidden md:block">
                    Dica: Você pode editar o nome, o curso e a data diretamente no certificado antes de imprimir.
                  </p>
                  <button 
                    onClick={() => {
                      const printContent = document.getElementById('certificate-content');
                      if (printContent) {
                        const originalContents = document.body.innerHTML;
                        
                        // Set inputs to text equivalents before printing, so they don't look like inputs.
                        // Or just use window.print and hide everything else with CSS.
                        document.body.innerHTML = printContent.innerHTML;
                        window.print();
                        document.body.innerHTML = originalContents;
                        window.location.reload(); // Reload to restore React state/listeners since innerHTML was blown away
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ml-auto"
                  >
                    <Printer className="w-5 h-5"/> Imprimir / Salvar PDF
                  </button>
              </div>
            </motion.div>
          </div>
        )}

        {showMaterialsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowMaterialsModal(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-mission-orange/10 flex items-center justify-center text-mission-orange">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Biblioteca do Aluno</h2>
                    <p className="text-slate-500 text-sm">Acesse e faça download dos materiais de apoio exclusivos das aulas.</p>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                  {loadingMaterials ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-mission-orange border-t-transparent"></div>
                      <p>Carregando materiais...</p>
                    </div>
                  ) : materials.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p className="font-medium">Nenhum material de apoio disponível no momento.</p>
                      <p className="text-sm text-slate-400 mt-1">Os coordenadores publicarão os materiais em breve.</p>
                    </div>
                  ) : (
                    materials.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-5 border border-slate-150 rounded-2xl bg-slate-50 hover:bg-slate-100/50 hover:border-mission-orange/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-mission-orange uppercase tracking-wider bg-orange-100 text-mission-orange px-2 py-0.5 rounded-md">
                              {item.module || 'Geral'}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-base">{item.title}</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="shrink-0 flex items-center justify-center gap-2 bg-mission-orange hover:bg-orange-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm"
                        >
                          <Download className="w-4 h-4" /> Download PDF
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowMaterialsModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini Icons
function StarIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function FlameIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
}
function ShieldIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
