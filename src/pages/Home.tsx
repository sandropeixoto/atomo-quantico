import { Zap } from 'lucide-react';

export function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-quantum-blue mb-4">Bem-vindo à Quantum</h1>
      <p className="text-lg text-gray-700 mb-8">Acelerando o futuro com soluções inovadoras.</p>
      <button className="bg-quantum-violet text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-all inline-flex items-center space-x-2">
        <Zap size={20} />
        <span>Comece Agora</span>
      </button>
    </div>
  );
}