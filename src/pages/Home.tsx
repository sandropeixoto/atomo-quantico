import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, runTransaction, collectionGroup, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ThumbsUp, MessageSquare, Feather } from 'lucide-react';

interface PublicEntry {
  id: string;
  text: string;
  authorId: string;
  timestamp: { seconds: number; };
  likesCount: number;
  commentsCount: number;
  authorName?: string;
}

export function Home() {
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [likedEntries, setLikedEntries] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPublicEntries = async () => {
    const q = query(collection(db, 'entries'), where('isPublic', '==', true), orderBy('timestamp', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const publicEntriesData: PublicEntry[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { text: string; authorId: string; timestamp: { seconds: number; }; likesCount: number; commentsCount: number; isPublic: boolean; }),
    }));

    const authorIds = [...new Set(publicEntriesData.map(entry => entry.authorId))];
    const usersData: { [key: string]: any } = {};

    if (authorIds.length > 0) {
      const usersRef = collection(db, 'users');
      // Como a Home já é limitada a 10, um único batch é suficiente, mas a lógica de batching é mantida para consistência
      for (let i = 0; i < authorIds.length; i += 10) {
        const chunk = authorIds.slice(i, i + 10);
        const usersQuery = query(usersRef, where('__name__', 'in', chunk));
        const usersSnapshot = await getDocs(usersQuery);
        usersSnapshot.docs.forEach(doc => {
          usersData[doc.id] = doc.data();
        });
      }

      publicEntriesData.forEach(entry => {
        entry.authorName = usersData[entry.authorId]?.displayName || 'Anônimo';
      });
    }

    setEntries(publicEntriesData);
  };

  const fetchUserLikes = async () => {
    if (!user) return;
    const likesQuery = query(collectionGroup(db, 'likes'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(likesQuery);
    const likedEntryIds = querySnapshot.docs.map(doc => doc.ref.parent.parent!.id);
    setLikedEntries(likedEntryIds);
  };

  useEffect(() => {
    fetchPublicEntries();
    if (user) {
      fetchUserLikes();
    } else {
      setLikedEntries([]);
    }
  }, [user]);

  const handleLike = async (entryId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const entryRef = doc(db, 'entries', entryId);
    const likeRef = doc(db, 'entries', entryId, 'likes', user.uid);
    const isLiked = likedEntries.includes(entryId);

    try {
      await runTransaction(db, async (transaction) => {
        const entryDoc = await transaction.get(entryRef);

        if (!entryDoc.exists()) {
          throw "A publicação não existe!";
        }

        const newLikesCount = entryDoc.data().likesCount || 0;

        if (isLiked) {
          transaction.delete(likeRef);
          transaction.update(entryRef, { likesCount: newLikesCount - 1 });
        } else {
          transaction.set(likeRef, { userId: user.uid, timestamp: new Date() });
          transaction.update(entryRef, { likesCount: newLikesCount + 1 });
        }
      });

      setLikedEntries(prev => isLiked ? prev.filter(id => id !== entryId) : [...prev, entryId]);
      setEntries(prevEntries => prevEntries.map(entry => {
        if (entry.id === entryId) {
          return { ...entry, likesCount: isLiked ? entry.likesCount - 1 : entry.likesCount + 1 };
        }
        return entry;
      }));

    } catch (e) {
      console.error("Erro na transação de curtida: ", e);
    }
  };

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

        <div className="w-full max-w-3xl mx-auto py-12 px-4 text-left">
            <h2 className="text-4xl font-bold text-center text-text-primary mb-12">Feed de Gratidão da Comunidade</h2>
            <div className="space-y-8">
                {entries.length > 0 ? (
                    entries.map(entry => (
                        <div key={entry.id} className="bg-background rounded-2xl shadow-lg p-6">
                            <p className="text-text-secondary leading-relaxed mb-4">{entry.text}</p>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <p>Postado por {entry.authorName} em {new Date(entry.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</p>
                                <div className="flex items-center space-x-4">
                                    <button 
                                        onClick={() => handleLike(entry.id)} 
                                        className={`flex items-center space-x-1 hover:text-secondary transition-colors ${likedEntries.includes(entry.id) ? 'text-secondary' : ''}`}>
                                        <ThumbsUp size={18} />
                                        <span>{entry.likesCount}</span>
                                    </button>
                                    <Link to={`/post/${entry.id}`} className="flex items-center space-x-1 hover:text-secondary transition-colors">
                                        <MessageSquare size={18} />
                                        <span>{entry.commentsCount}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-text-secondary">Nenhuma entrada pública ainda. Seja o primeiro!</p>
                )}
            </div>
            {entries.length > 0 && (
              <div className="text-center mt-8">
                <Link to="/public-feed" className="text-secondary hover:underline">
                  Ver mais...
                </Link>
              </div>
            )}
        </div>
    </div>
  );
}
