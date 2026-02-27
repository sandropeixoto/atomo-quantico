import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AtomoQuanticoLogo } from './AtomoQuanticoLogo';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { LogOut, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { StatusQuantico } from './StatusQuântico';
import StreakCounter from './StreakCounter';

export function Header() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Lado Esquerdo: Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <AtomoQuanticoLogo />
          <span className="text-xl font-semibold text-text-primary">Átomo Quântico</span>
        </Link>

        {/* Centro: Status Quântico (apenas para usuários logados) */}
        {user && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 hidden md:flex">
            <StatusQuantico />
            <StreakCounter />
          </div>
        )}

        {/* Lado Direito: Ícone do Menu e Ações do Usuário */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-text-secondary hover:text-red-500 transition-colors p-2 rounded-full hidden sm:flex"
              title="Sair"
            >
              <LogOut size={22} />
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-secondary text-text-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity hidden sm:flex"
            >
              Login
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-text-primary p-2"
            aria-label="Abrir menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Renderiza o Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </header>
  );
}
