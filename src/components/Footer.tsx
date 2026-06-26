import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <img 
                src="https://i.ibb.co/d4SnxmhJ/logo-2-escola-missionaria-trandcultural-removebg-preview-1.png" 
                alt="Logo Escola Missionária Transcultural" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Preparando e equipando missionários transculturais para alcançar as nações com a mensagem do Reino.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Links Rápidos</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/sobre" className="hover:text-mission-orange transition-colors">Sobre a Escola</Link></li>
              <li><Link to="/cursos" className="hover:text-mission-orange transition-colors">Cursos Disponíveis</Link></li>
              <li><Link to="/projetos" className="hover:text-mission-orange transition-colors">Projetos Missionários</Link></li>
              <li><Link to="/doacoes" className="hover:text-mission-orange transition-colors">Faça uma Doação</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Recursos</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/biblioteca" className="hover:text-mission-orange transition-colors">Biblioteca Digital</Link></li>
              <li><Link to="/devocionais" className="hover:text-mission-orange transition-colors">Devocionais</Link></li>
              <li><Link to="/loja" className="hover:text-mission-orange transition-colors">Loja Missionária</Link></li>
              <li><Link to="/dashboard" className="hover:text-mission-orange transition-colors">Área do Aluno</Link></li>
              <li><Link to="/admin" className="hover:text-mission-orange transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Contato</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-mission-orange shrink-0" />
                <span className="text-slate-400">Rua das Nações, 100 - Centro<br/>São Paulo, SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-mission-orange shrink-0" />
                <span className="text-slate-400">+55 (16) 99732-7255</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-mission-orange shrink-0" />
                <span className="text-slate-400">falecommissoes@gmail.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Escola Missionária Transcultural. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="#" className="hover:text-white transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
