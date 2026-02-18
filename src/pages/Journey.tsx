import { useState, useEffect } from 'react';
import { useUserProgressStore } from '../stores/userProgressStore';
import { Zap, Award, Atom } from 'lucide-react';
import { ProbabilityCloud } from '../components/ProbabilityCloud';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

interface JournalEntry {
  text: string;
}

export function Journey() {
  const { user } = useAuth();
  const { photons, level, levelName, progress, isInitialized } = useUserProgressStore();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'entries'), where('authorId', '==', user.uid), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ text: doc.data().text }));
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    if (user) {
      fetchEntries();
    }
  }, [user]);

  // Mostra um estado de carregamento enquanto os dados do usuário estão sendo buscados
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Atom className="text-secondary animate-spin" size={48} />
        <p className="text-text-secondary mt-4">Carregando sua jornada quântica...</p>
      </div>
    );
  }

  // Mensagem para usuários não logados
  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-text-primary">Sua jornada começa com o primeiro passo.</h2>
        <p className="text-text-secondary mt-2 mb-6">Faça <Link to="/login" className="text-secondary font-semibold hover:underline">login</Link> para ver seu progresso.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-text-primary mb-12">Sua Jornada Quântica</h1>

      {/* Métricas do Usuário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-primary p-6 rounded-xl shadow-lg flex items-center space-x-6 transform hover:scale-105 transition-transform duration-300">
          <Zap className="text-yellow-400" size={48} />
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Fótons de Gratidão</h2>
            <p className="text-5xl font-extrabold text-secondary">{photons}</p>
          </div>
        </div>
        <div className="bg-primary p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-text-primary">Nível Quântico</h2>
            <p className="font-bold text-secondary text-lg">{`Nível ${level}`}</p>
          </div>
          <p className="text-xl font-semibold text-accent mb-3">{levelName}</p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-secondary h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-right text-sm text-text-secondary mt-1">{`${Math.floor(progress)}% para o próximo nível`}</p>
        </div>
      </div>

      {/* Conquistas (Em Breve) */}
      <div className="bg-primary p-8 rounded-xl shadow-lg mb-12 text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4 flex items-center justify-center">
          <Award className="text-yellow-500 mr-3" size={30} />
          Conquistas
        </h2>
        <p className="text-text-secondary">Em breve: Desbloqueie medalhas e recompensas exclusivas ao atingir novos marcos em sua jornada de gratidão!</p>
      </div>

      {/* Nuvem de Probabilidades */}
      <div className="bg-primary p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">Sua Nuvem de Gratidão</h2>
        <ProbabilityCloud entries={entries} />
        <div className="text-center mt-6">
          <Link to="/gratitude-journal" className="text-secondary hover:underline">
            Gerenciar suas entradas no Diário &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
