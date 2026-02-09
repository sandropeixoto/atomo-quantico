import { Link } from 'react-router-dom';
import { Feather } from 'lucide-react';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="bg-accent rounded-full p-4 mb-6">
        <Feather size={40} className="text-secondary" />
      </div>
      <h1 className="text-5xl font-bold text-text-primary mb-4">Seu Santuário Pessoal de Gratidão</h1>
      <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">O Átomo Quântico é um espaço para cultivar a gratidão, refletir sobre suas alegrias e encontrar a beleza nos pequenos momentos da vida.</p>
      <Link 
        to="/gratitude-journal"
        className="bg-secondary text-text-primary font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-all inline-flex items-center space-x-2 text-lg"
      >
        <span>Comece a Escrever</span>
      </Link>
    </div>
  );
}