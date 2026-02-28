
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUserProgressStore } from '../stores/userProgressStore';
import { ProbabilityCloud } from '../components/ProbabilityCloud';
import { PenSquare } from 'lucide-react';

interface JournalEntry {
  id: string;
  text: string;
  timestamp: { seconds: number; };
  isPublic: boolean;
}

const GratitudeJournal = () => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const { user } = useAuth();
  const { earnPhotons } = useUserProgressStore();

  const fetchEntries = async () => {
    if (!user) return;
    const q = query(collection(db, 'entries'), where('authorId', '==', user.uid), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const entriesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { text: string; timestamp: { seconds: number; }; isPublic: boolean; }),
    }));
    setEntries(entriesData);
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (entry.trim() === '' || !user) return;

    try {
      await addDoc(collection(db, 'entries'), {
        text: entry,
        timestamp: new Date(),
        authorId: user.uid,
        isPublic: isPublic,
        likesCount: 0,
        commentsCount: 0,
      });

      earnPhotons('create_entry');

      setEntry('');
      setIsPublic(true);
      fetchEntries(); // Atualiza a lista de entradas
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-text-primary">Por favor, faça login para ver seu diário.</h2>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-text-primary mb-12">Meu Diário de Gratidão</h1>

      <div className="bg-background rounded-2xl shadow-lg p-8 mb-12">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Pelo que você é grato hoje?</h2>
          <textarea
            className="w-full p-4 bg-primary text-text-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow placeholder:text-gray-400"
            rows={5}
            placeholder="Comece a escrever..."
            value={entry}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEntry(e.target.value)}
          />

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-text-secondary">
              Tornar esta entrada pública
            </label>
          </div>

          <button
            type="submit"
            className="bg-secondary text-text-primary font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity mt-4 inline-flex items-center space-x-2"
          >
            <PenSquare size={20} />
            <span>Registrar Gratidão</span>
          </button>
        </form>
      </div>

      <div className="bg-background rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">Sua Nuvem de Gratidão</h2>
        {/* A correção é aqui: passamos o estado 'entries' para o componente */}
        <ProbabilityCloud entries={entries} />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-text-primary mb-8">Suas Memórias de Gratidão</h2>
        <div className="space-y-6">
          {entries.length > 0 ? (
            entries.map((entryItem) => (
              <div key={entryItem.id} className="bg-background rounded-xl shadow-md p-6 border-l-4 border-accent">
                {entryItem.isPublic && <span className="text-xs font-semibold text-secondary bg-secondary/10 py-1 px-2 rounded-full mb-2 inline-block">Público</span>}
                <p className="text-text-secondary leading-relaxed mb-3">{entryItem.text}</p>
                <p className="text-sm text-gray-400 font-light">
                  {new Date(entryItem.timestamp.seconds * 1000).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-text-secondary">Você ainda não tem nenhuma entrada. Comece a escrever acima!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GratitudeJournal;
