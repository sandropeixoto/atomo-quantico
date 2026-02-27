import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, runTransaction, collectionGroup, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ThumbsUp, MessageSquare, Award } from 'lucide-react';
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

const JourneySummary = () => {
  const { user } = useAuth();
  const { photons, level, levelName, progress } = useUserProgressStore();

  if (!user) {
    return (
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-text-primary mb-3">Bem-vindo ao Átomo de Gratidão</h1>
        <p className="text-text-secondary text-lg">
          Seu santuário pessoal para cultivar a gratidão. <Link to="/login" className="text-secondary font-semibold hover:underline">Faça login para iniciar sua jornada</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary rounded-2xl shadow-lg p-8 mb-12">
      <h2 className="text-3xl font-bold text-text-primary mb-2">Sua Jornada Quântica</h2>
      <p className="text-text-secondary mb-6">Este é um resumo do seu progresso. Continue interagindo para evoluir!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-background rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-bold text-secondary">{photons}</span>
          <span className="text-text-secondary mt-1">Fótons de Gratidão ⚛️</span>
        </div>
        <div className="bg-background rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2">
            <Award className="text-accent" size={32} />
            <span className="text-3xl font-bold text-text-primary">{levelName}</span>
          </div>
          <span className="text-text-secondary mt-1">Nível {level}</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-text-secondary">Progresso para o próximo nível</span>
          <span className="text-sm font-medium text-text-secondary">{Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="text-center mt-8">
        <Link to="/journey" className="bg-secondary text-text-primary font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">Ver Minha Jornada Completa</Link>
      </div>
    </div>
  );
}

export const Home = () => {
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [likedEntries, setLikedEntries] = useState<string[]>([]);
  const [showReward, setShowReward] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { earnPhotons } = useUserProgressStore();

  const fetchPublicEntries = async () => {
    const q = query(collection(db, 'entries'), where('isPublic', '==', true), orderBy('timestamp', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const publicEntriesData: PublicEntry[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    const authorIds = [...new Set(publicEntriesData.map(entry => entry.authorId))];
    if (authorIds.length === 0) {
      setEntries(publicEntriesData);
      return;
    }
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, where('__name__', 'in', authorIds.slice(0, 10)));
    const usersSnapshot = await getDocs(usersQuery);
    const usersData: Record<string, any> = usersSnapshot.docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.data() }), {});
    publicEntriesData.forEach(entry => { entry.authorName = usersData[entry.authorId]?.displayName || 'Anônimo'; });
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
    if (user) fetchUserLikes();
    else setLikedEntries([]);
  }, [user]);

  const handleLike = async (entryId: string, authorId: string) => {
    if (!user) { navigate('/login'); return; }
    const isLiked = likedEntries.includes(entryId);
    if (!isLiked) {
      earnPhotons('like', authorId);
      setShowReward(entryId);
      setTimeout(() => setShowReward(null), 1000);
    }
    const entryRef = doc(db, 'entries', entryId);
    const likeRef = doc(db, 'entries', entryId, 'likes', user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const entryDoc = await transaction.get(entryRef);
        if (!entryDoc.exists()) throw "Error";
        const newLikesCount = (entryDoc.data().likesCount || 0) + (isLiked ? -1 : 1);
        transaction.update(entryRef, { likesCount: newLikesCount });
        if (isLiked) transaction.delete(likeRef);
        else transaction.set(likeRef, { userId: user.uid });
      });
      setLikedEntries(prev => isLiked ? prev.filter(id => id !== entryId) : [...prev, entryId]);
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, likesCount: e.likesCount + (isLiked ? -1 : 1) } : e));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <JourneySummary />
      <div className="bg-background rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-6">Gratidão em Destaque</h2>
        <div className="space-y-8">
          {entries.map(entry => (
            <div key={entry.id} className="bg-primary rounded-2xl shadow-lg p-6 relative">
              <p className="text-text-secondary leading-relaxed mb-4">{entry.text}</p>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <p>Postado por <Link to={`/profile/${entry.authorId}`} className="hover:underline">{entry.authorName}</Link></p>
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleLike(entry.id, entry.authorId)} className={`flex items-center space-x-1 relative ${likedEntries.includes(entry.id) ? 'text-secondary' : ''}`}>
                    <ThumbsUp size={18} />
                    <span>{entry.likesCount || 0}</span>
                    {showReward === entry.id && <div className="reward-animation">+1 ⚛️</div>}
                  </button>
                  <Link to={`/post/${entry.id}`} className="flex items-center space-x-1">
                    <MessageSquare size={18} />
                    <span>{entry.commentsCount || 0}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/public-feed" className="text-secondary font-semibold hover:underline">Ver todo o feed de gratidão →</Link>
        </div>
      </div>
      <style>{`
        .reward-animation { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); animation: floatUp 1s ease-out forwards; font-size: 1.2rem; font-weight: bold; color: #4ade80; }
        @keyframes floatUp { 0% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, -50px); } }
    `}</style>
    </div>
  );
};
