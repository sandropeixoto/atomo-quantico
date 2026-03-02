import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Star, Info, User } from 'lucide-react';

export function Footer() {
  const location = useLocation();

  const navItems = [
    { href: '/', icon: <Home />, label: 'Feed' },
    { href: '/gratitude-journal', icon: <BookOpen />, label: 'Diário' },
    { href: '/journey', icon: <Star />, label: 'Jornada' },
    { href: '/about', icon: <Info />, label: 'Sobre' },
    { href: '/profile', icon: <User />, label: 'Perfil' },
  ];

  return (
    <footer className="bg-primary sticky bottom-0 w-full border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <nav className="flex justify-around items-center min-h-[4.5rem] pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-accent' : 'text-text-secondary'}`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-accent/20' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
