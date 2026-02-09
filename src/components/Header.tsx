import { Link } from 'react-router-dom';
import { QuantumLogo } from './QuantumLogo';

export function Header() {
  return (
    <header className="bg-quantum-blue text-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <QuantumLogo />
          <span className="text-2xl font-bold">Quantum</span>
        </Link>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-quantum-violet transition-colors">Home</Link></li>
          <li><Link to="/about" className="hover:text-quantum-violet transition-colors">Sobre</Link></li>
          <li><Link to="/contact" className="hover:text-quantum-violet transition-colors">Contato</Link></li>
        </ul>
      </nav>
    </header>
  );
}