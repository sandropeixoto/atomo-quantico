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
    <footer className="bg-primary sticky bottom-0 w-full pb-[env(safe-area-inset-bottom)]">
      <nav className="flex justify-around items-center h-16">
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
