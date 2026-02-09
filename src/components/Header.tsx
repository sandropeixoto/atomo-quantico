import { Link } from 'react-router-dom';
import { AtomoQuanticoLogo } from './AtomoQuanticoLogo';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { LogOut } from 'lucide-react';

export function Header() {
  const { user } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="bg-transparent py-4">
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <AtomoQuanticoLogo />
          <span className="text-xl font-semibold text-text-primary">Átomo Quântico</span>
        </Link>
        <ul className="flex space-x-8 items-center text-text-secondary font-medium">
          <li><Link to="/" className="hover:text-text-primary transition-colors">Home</Link></li>
          <li><Link to="/about" className="hover:text-text-primary transition-colors">Sobre</Link></li>
          <li><Link to="/gratitude-journal" className="hover:text-text-primary transition-colors">Diário</Link></li>
          {user ? (
            <li className='flex items-center'>
              <span className="mr-4 text-sm">Olá, {user.displayName}</span>
              <button 
                onClick={handleLogout} 
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </li>
          ) : (
            <li><Link to="/login" className="bg-secondary text-text-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}