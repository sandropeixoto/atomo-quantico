import { useUserProgressStore } from '../stores/userProgressStore';
import { BarChart, Zap, Award } from 'lucide-react'; // Badge removido
import { ProbabilityCloud } from '../components/ProbabilityCloud';
import { EntropyParticle } from '../components/EntropyParticle'; // Importe a partícula
import { Link } from 'react-router-dom';

export function Journey() {
  const { photons, level, streak, badges } = useUserProgressStore();

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-text-primary mb-12">Sua Jornada Quântica</h1>

      {/* Métricas do Usuário */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
        <div className="bg-primary p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Zap className="mx-auto text-yellow-400 mb-3" size={40} />
          <h2 className="text-2xl font-bold text-text-primary">Fótons</h2>
          <p className="text-4xl font-extrabold text-secondary">{photons}</p>
        </div>
        <div className="bg-primary p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <BarChart className="mx-auto text-green-400 mb-3" size={40} />
          <h2 className="text-2xl font-bold text-text-primary">Nível</h2>
          <p className="text-4xl font-extrabold text-secondary">{level}</p>
        </div>
        {/* Nível de Entropia com a Partícula */}
        <div className="bg-primary p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Nível de Entropia</h2>
          <EntropyParticle />
        </div>
      </div>

      {/* Conquistas */}
      <div className="bg-primary p-8 rounded-xl shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center">
                <Award className="text-yellow-500 mr-3" size={30} /> 
                Conquistas Desbloqueadas
            </h2>
            {badges.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {badges.map((badge, index) => (
                        <div key={index} className="bg-secondary/20 text-text-primary font-semibold py-2 px-4 rounded-full text-center">
                            {badge}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-text-secondary">Continue sua jornada para desbloquear novas conquistas!</p>
            )}
      </div>

       {/* Nuvem de Probabilidades */}
       <div className="bg-primary p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-text-primary mb-6">Sua Nuvem de Gratidão</h2>
            <ProbabilityCloud />
            <div className="text-center mt-6">
                <Link to="/gratitude-journal" className="text-secondary hover:underline">
                    Veja sua nuvem de palavras completa em seu Diário de Gratidão &rarr;
                </Link>
            </div>
       </div>
    </div>
  );
}
