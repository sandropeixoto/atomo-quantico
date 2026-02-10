import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, runTransaction, collectionGroup } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { useUserProgressStore } from '../stores/userProgressStore';

interface PublicEntry {
  id: string;
  text: string;
  authorId: string;
  timestamp: { seconds: number; };
  likesCount: number;
  commentsCount: number;
  authorName?: string;
}

const PublicFeed = () => {
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [likedEntries, setLikedEntries] = useState<string[]>([]);
  const [showReward, setShowReward] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { interactWithPost } = useUserProgressStore();

  const fetchPublicEntries = async () => {
    const q = query(collection(db, 'entries'), where('isPublic', '==', true), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const publicEntriesData: PublicEntry[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { text: string; authorId: string; timestamp: { seconds: number; }; likesCount: number; commentsCount: number; isPublic: boolean; }),
    }));

    const authorIds = [...new Set(publicEntriesData.map(entry => entry.authorId))];
    const usersData: { [key: string]: any } = {};

    if (authorIds.length > 0) {
      const usersRef = collection(db, 'users');
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

  const handleLike = async (entryId: string, authorId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const entryRef = doc(db, 'entries', entryId);
    const likeRef = doc(db, 'entries', entryId, 'likes', user.uid);
    const isLiked = likedEntries.includes(entryId);

    if (!isLiked) {
        interactWithPost('like', authorId);
        setShowReward(entryId);
        setTimeout(() => setShowReward(null), 1000);
    }

    try {
      await runTransaction(db, async (transaction) => {
        const entryDoc = await transaction.get(entryRef);
        if (!entryDoc.exists()) throw "A publicação não existe!";
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
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-text-primary mb-12">Feed de Gratidão Completo</h1>
      <div className="space-y-8">
        {entries.length > 0 ? (
          entries.map(entry => (
            <div key={entry.id} className="bg-primary rounded-2xl shadow-lg p-6 relative">
              <p className="text-text-secondary leading-relaxed mb-4">{entry.text}</p>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <p>Postado por {entry.authorName} em {new Date(entry.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</p>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(entry.id, entry.authorId)} 
                    className={`flex items-center space-x-1 hover:text-secondary transition-colors relative ${likedEntries.includes(entry.id) ? 'text-secondary' : ''}`}>
                    <ThumbsUp size={18} />
                    <span>{entry.likesCount}</span>
                    {showReward === entry.id && (
                        <div className="reward-animation">+1 ⚛️</div>
                    )}
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
          <p className="text-center text-text-secondary">Nenhuma entrada pública ainda. Seja o primeiro a compartilhar!</p>
        )}
      </div>
       <style>{`
        .reward-animation {
            position: absolute; bottom: 100%; left: 50%;
            transform: translateX(-50%);
            animation: floatUp 1s ease-out forwards;
            font-size: 1.2rem; font-weight: bold; color: #4ade80;
        }
        @keyframes floatUp {
            0% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -50px); }
        }
    `}</style>
    </div>
  );
};

export default PublicFeed;
