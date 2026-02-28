import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, runTransaction, collectionGroup, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { useUserProgressStore } from '../stores/userProgressStore';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="bg-primary rounded-2xl shadow-lg p-5 sm:p-8 mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Sua Jornada Quântica</h2>
      <p className="text-text-secondary text-sm sm:text-base mb-6">Este é um resumo do seu progresso. Continue interagindo para evoluir!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-background rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-bold text-secondary">{photons}</span>
          <span className="text-xs sm:text-sm text-text-secondary mt-1 uppercase tracking-wider">Fótons de Gratidão ⚛️</span>
        </div>
        <div className="bg-background rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2">
            <Award className="text-accent" size={28} />
            <span className="text-2xl sm:text-3xl font-bold text-text-primary">{levelName}</span>
          </div>
          <span className="text-xs sm:text-sm text-text-secondary mt-1 uppercase tracking-wider">Nível {level}</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-text-secondary">Progresso</span>
          <span className="text-xs font-medium text-text-secondary">{Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-secondary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="text-center mt-6 sm:mt-8">
        <Link to="/journey" className="inline-block bg-secondary text-text-primary font-semibold py-3 px-6 sm:px-8 rounded-full hover:opacity-90 transition-opacity text-sm sm:text-base">Ver Minha Jornada Completa</Link>
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
    
    // UI Otimista para likes
    setLikedEntries(prev => isLiked ? prev.filter(id => id !== entryId) : [...prev, entryId]);
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, likesCount: e.likesCount + (isLiked ? -1 : 1) } : e));

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
    } catch (e) { 
      console.error(e);
      // Reverter UI otimista em caso de erro
      fetchPublicEntries(); 
      fetchUserLikes();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-12 px-1 sm:px-4">
      <JourneySummary />
      <div className="bg-background rounded-2xl shadow-lg p-5 sm:p-8 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">Gratidão em Destaque</h2>
        <div className="space-y-6 sm:space-y-8">
          {entries.map(entry => (
            <div key={entry.id} className="bg-primary rounded-2xl shadow-lg p-5 sm:p-6 relative">
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">{entry.text}</p>
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                <p>Por <Link to={`/profile/${entry.authorId}`} className="hover:underline font-medium text-text-secondary">{entry.authorName}</Link></p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleLike(entry.id, entry.authorId)} 
                    className={`flex items-center space-x-1.5 relative ${likedEntries.includes(entry.id) ? 'text-secondary' : ''} p-2 -m-2`}
                  >
                    <ThumbsUp size={18} />
                    <span className="font-bold">{entry.likesCount || 0}</span>
                    <AnimatePresence>
                      {showReward === entry.id && (
                        <motion.div 
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -40 }}
                          exit={{ opacity: 0 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 text-accent font-bold whitespace-nowrap pointer-events-none"
                        >
                          +1 Fóton ⚛️
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <Link to={`/post/${entry.id}`} className="flex items-center space-x-1.5 p-2 -m-2">
                    <MessageSquare size={18} />
                    <span className="font-bold">{entry.commentsCount || 0}</span>
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
    </div>
  );
};
