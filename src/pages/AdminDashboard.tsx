import React, { useState } from 'react';
import { Users, GraduationCap, FileText, CheckCircle, Clock, BookOpen, AlertCircle, BarChart3, Settings, LogOut, ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AdminProducts } from './AdminProducts';
import { AdminContent } from './AdminContent';
import { AdminResources } from './AdminResources';
import { AdminTeachers } from './AdminTeachers';
import { AdminLeads } from './AdminLeads';
import { AdminStudentMaterials } from './AdminStudentMaterials';

const MOCK_STUDENTS = [
  { id: 1, name: 'João Silva', email: 'joao.silva@email.com', progress: 32, status: 'Ativo', lastActive: 'Hoje', enrolledDate: '10/01/2026' },
  { id: 2, name: 'Maria Souza', email: 'maria.souza@email.com', progress: 85, status: 'Ativo', lastActive: 'Ontem', enrolledDate: '15/02/2026' },
  { id: 3, name: 'Pedro Almeida', email: 'pedro.almeida@email.com', progress: 12, status: 'Bloqueado', lastActive: 'Há 5 dias', enrolledDate: '05/03/2026' },
  { id: 4, name: 'Ana Costa', email: 'ana.costa@email.com', progress: 100, status: 'Concluído', lastActive: 'Hoje', enrolledDate: '20/11/2025' },
  { id: 5, name: 'Lucas Pereira', email: 'lucas.pereira@email.com', progress: 45, status: 'Ativo', lastActive: 'Há 2 dias', enrolledDate: '12/04/2026' },
];

const MOCK_EXAMS = [
  { id: 1, student: 'Maria Souza', course: 'Missões Transculturais', module: 'Módulo 3: Povos Não Alcançados', score: 95, date: '25/05/2026', status: 'Aprovado' },
  { id: 2, student: 'João Silva', course: 'Missões Transculturais', module: 'Módulo 1: Fundamentos', score: 60, date: '24/05/2026', status: 'Reprovado' },
  { id: 3, student: 'Ana Costa', course: 'Plantação de Igrejas', module: 'Módulo Final: Projeto Prático', score: 100, date: '20/05/2026', status: 'Aprovado' },
];

const STATS = [
  { title: 'Total de Alunos', value: '1,245', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Alunos Ativos', value: '892', icon: Activity, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Aulas Assistidas (Mês)', value: '4.5k', icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Provas Corrigidas', value: '128', icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

function Activity({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

export function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'exams' | 'content' | 'products' | 'resources' | 'teachers' | 'leads' | 'student_materials'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin text-mission-orange w-8 h-8 rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  const isAdminSession = localStorage.getItem('admin_session') === 'true';

  if (!isAdminSession && (!user || user.email !== 'nogueiralfha@gmail.com')) {
    return <Navigate to="/admin-login" replace />;
  }

  const filteredStudents = MOCK_STUDENTS.filter((student) => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Admin Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-mission-orange rounded-xl flex items-center justify-center text-white shadow-lg">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Painel do Administrador</h1>
              <p className="text-slate-400 text-sm">Escola Missionária Transcultural</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm hidden md:inline-block">Modo Administrativo</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-px">
          {['overview', 'students', 'exams', 'content', 'products', 'resources', 'teachers', 'leads', 'student_materials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-mission-orange text-mission-orange'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'students' && 'Gestão de Alunos'}
              {tab === 'exams' && 'Provas & Avaliações'}
              {tab === 'content' && 'Gestão de Conteúdos'}
              {tab === 'products' && 'Produtos da Loja'}
              {tab === 'resources' && 'Recursos & Novidades'}
              {tab === 'teachers' && 'Corpo Docente'}
              {tab === 'leads' && 'Contatos Capturados (Leads)'}
              {tab === 'student_materials' && 'Materiais dos Alunos'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {STATS.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center \${stat.bgColor} \${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Entradas Recentes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-mission-orange" />
                  Alunos Recentes
                </h3>
                <div className="space-y-4">
                  {MOCK_STUDENTS.slice(0, 3).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 rounded-full">
                        {student.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provas Recentes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-mission-orange" />
                  Últimas Avaliações
                </h3>
                <div className="space-y-4">
                  {MOCK_EXAMS.slice(0, 3).map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{exam.student}</p>
                        <p className="text-xs text-slate-500">{exam.module}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold \${exam.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                          {exam.score} / 100
                        </p>
                        <p className="text-xs text-slate-500">{exam.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'students' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Gestão de Alunos</h3>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-mission-orange focus:border-mission-orange outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Aluno</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Progresso Curso</th>
                    <th className="px-6 py-4">Último Acesso</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2py-1 text-xs font-semibold rounded-full \${
                          student.status === 'Ativo' ? 'bg-green-100 text-green-700' : 
                          student.status === 'Bloqueado' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-mission-orange" style={{ width: `\${student.progress}%` }} />
                          </div>
                          <span className="text-xs font-medium">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">{student.lastActive}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-mission-orange hover:text-orange-700 font-medium text-xs border border-mission-orange/20 px-3 py-1.5 rounded bg-orange-50 hover:bg-orange-100 transition-colors">
                          Acessar Perfil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Nenhum aluno encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'exams' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Provas e Avaliações Requerendo Atenção</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {MOCK_EXAMS.map((exam) => (
                  <div key={exam.id} className="p-5 border border-slate-200 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex gap-4 items-start">
                      <div className={`p-3 rounded-xl \${exam.score >= 70 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {exam.score >= 70 ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{exam.student}</h4>
                        <p className="text-sm text-slate-600">{exam.course} • {exam.module}</p>
                        <p className="text-xs text-slate-400 mt-1">Realizada em: {exam.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end w-full md:w-auto">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-slate-900">{exam.score}</span>
                        <span className="text-sm text-slate-500">/ 100</span>
                      </div>
                      <button className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                        Ver Detalhes <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AdminContent />
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AdminProducts />
          </motion.div>
        )}

        {activeTab === 'resources' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AdminResources />
          </motion.div>
        )}

        {activeTab === 'teachers' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AdminTeachers />
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AdminLeads />
          </motion.div>
        )}

        {activeTab === 'student_materials' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AdminStudentMaterials />
          </motion.div>
        )}
      </div>
    </div>
  );
}
