import { useUserProgressStore } from '../stores/userProgressStore';
import { Zap, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Componente para mostrar um resumo do progresso do usuário
export function StatusQuantico() {
  const { photons, level, isInitialized } = useUserProgressStore();

  // Não renderiza nada se os dados ainda não foram carregados
  if (!isInitialized) {
    return null;
  }

  return (
    <Link to="/journey" className="flex items-center gap-4 bg-primary/50 border border-slate-700 rounded-full px-4 py-1.5 hover:bg-primary/80 transition-colors shadow-md">
      <div className="flex items-center gap-2" title={`Fótons de Gratidão: ${photons}`}>
        <Zap className="text-yellow-400" size={18} />
        <span className="font-bold text-text-primary text-sm">{photons}</span>
      </div>
      <div className="w-px h-4 bg-slate-600"></div> {/* Divisor vertical */}
      <div className="flex items-center gap-2" title={`Nível Quântico: ${level}`}>
        <BarChart className="text-green-400" size={18} />
        <span className="font-bold text-text-primary text-sm">{level}</span>
      </div>
    </Link>
  );
}
