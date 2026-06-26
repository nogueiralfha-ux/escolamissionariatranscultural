import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Cursos', path: '/cursos' },
  { name: 'Recursos', path: '/recursos' },
  { name: 'Área do Aluno', path: '/dashboard' },
  { name: 'Projetos', path: '/projetos' },
  { name: 'Atlas de Povos', path: '/atlas' },
  { name: 'Admin', path: '/admin' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const filteredNavLinks = navLinks;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/logo-small.png" 
                alt="Logo Escola Missionária Transcultural" 
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {filteredNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-mission-orange',
                    isActive ? 'text-mission-orange' : 'text-slate-600'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
              <Link
                to="/inscricao"
                className="bg-mission-orange hover:bg-mission-orange-light text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                Fazer Inscrição
              </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {filteredNavLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-3 rounded-md text-base font-medium',
                      isActive
                        ? 'bg-orange-50 text-mission-orange'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4">
                <Link
                  to="/inscricao"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-mission-orange hover:bg-mission-orange-light text-white px-5 py-3 rounded-xl font-medium transition-colors"
                >
                  Fazer Inscrição
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
