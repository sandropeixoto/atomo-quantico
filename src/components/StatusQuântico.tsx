import { Zap, Star } from 'lucide-react';
import { useUserProgressStore } from '../stores/userProgressStore';
import { EntropyParticle } from './EntropyParticle'; // Importe a partícula

export function StatusQuântico() {
  // Conecte-se ao store para obter os dados mais recentes
  const { photons, badges } = useUserProgressStore();

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Seu Status Quântico</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card de Nível de Entropia */}
        <div className="bg-primary p-4 rounded-lg flex flex-col justify-center items-center text-center">
           <h3 className="text-lg font-semibold text-text-secondary mb-3">Nível de Entropia</h3>
           <EntropyParticle />
        </div>

        {/* Card de Fótons (Partículas de Insight) */}
        <div className="bg-primary p-4 rounded-lg flex items-center">
          <Zap size={28} className="text-yellow-400 mr-4" />
          <div>
            <p className="text-text-secondary">Fótons</p>
            <p className="text-2xl font-bold text-text-primary">{photons}</p>
          </div>
        </div>

        {/* Card de Conquistas (Badges) */}
        <div className="bg-primary p-4 rounded-lg flex items-center">
          <Star size={28} className="text-yellow-500 mr-4" />
          <div>
            <p className="text-text-secondary">Conquistas</p>
            <p className="text-2xl font-bold text-text-primary">{badges.length}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
