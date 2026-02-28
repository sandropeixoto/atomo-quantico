
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Target, Award, Info, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProgressStore } from '../stores/userProgressStore';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const menuVariants: Variants = {
  hidden: {
    x: '-100%',
  },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const navItems = [
  { name: 'Home / Feed', to: '/', icon: Home },
  { name: 'Diário de Gratidão', to: '/gratitude-journal', icon: BookOpen },
  { name: 'Minha Jornada', to: '/journey', icon: Target }, // Corrigido para 'Minha Jornada' e link '/journey'
  { name: 'Conquistas', to: '/journey', icon: Award }, // Aponta para a página de jornada por enquanto
  { name: 'Sobre o Projeto', to: '/about', icon: Info },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user } = useAuth();
  const { photons } = useUserProgressStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 left-0 bottom-0 w-72 bg-[#0D0B1A] border-r border-secondary/30 shadow-2xl z-50 flex flex-col"
          >
            {/* Cabeçalho do Menu */}
            <div className="p-6 flex items-center justify-between border-b border-slate-700">
              <h2 className="text-xl font-bold text-text-primary">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X size={24} />
              </button>
            </div>

            {/* Perfil do Usuário (Mini) */}
            {user && (
              <div className="p-6 border-b border-slate-700">
                <p className="text-lg font-semibold text-text-primary">{user.displayName || 'Viajante'}</p>
                <p className="text-sm text-yellow-400">{`${photons} Fótons`}</p>
              </div>
            )}

            {/* Itens de Navegação */}
            <nav className="flex-grow p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-4 p-3 rounded-lg text-text-secondary hover:bg-slate-800 hover:text-text-primary transition-colors duration-200"
                    >
                      <item.icon size={22} />
                      <span className="text-lg">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
