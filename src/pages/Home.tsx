import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, runTransaction, collectionGroup, limit, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ThumbsUp, MessageSquare, Award, User, Send } from 'lucide-react';
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
      <div className="text-center mb-12 py-8 bg-primary/30 rounded-3xl border border-gray-800">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-4 px-4">Cultive Gratidão</h1>
        <p className="text-text-secondary text-lg mb-6 px-4">
          Seu santuário pessoal para evoluir sua consciência.
        </p>
        <Link to="/login" className="bg-secondary text-text-primary font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">Iniciar Jornada</Link>
      </div>
    );
  }

  return (
    <div className="bg-primary rounded-2xl shadow-lg p-5 sm:p-6 mb-8 border border-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Award className="text-accent" size={24} /> {levelName}
          </h2>
          <p className="text-text-secondary text-sm">Nível {level}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-secondary">{photons}</span>
          <span className="text-xs text-text-secondary ml-2 uppercase tracking-tighter font-bold">Fótons ⚛️</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-text-secondary uppercase">
          <span>Evolução</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-secondary h-full rounded-full" 
          />
        </div>
      </div>
    </div>
  );
}

const GratitudeInput = ({ onPostSuccess }: { onPostSuccess: () => void }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [isPosting, setIsLiking] = useState(false);
  const { earnPhotons } = useUserProgressStore();

  const handlePost = async () => {
    if (!text.trim() || !user || isPosting) return;
    setIsLiking(true);
    try {
      await addDoc(collection(db, 'entries'), {
        text: text.trim(),
        timestamp: new Date(),
        authorId: user.uid,
        isPublic: true,
        likesCount: 0,
        commentsCount: 0,
      });
      await earnPhotons('create_entry');
      setText('');
      onPostSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-primary rounded-2xl p-4 mb-8 border border-gray-800">
      <div className="flex items-start space-x-3">
        <div className="bg-secondary/20 p-2 rounded-full hidden sm:block">
          <User className="text-secondary" size={24} />
        </div>
        <div className="flex-1">
          <textarea
            className="w-full bg-transparent text-text-primary text-xl focus:outline-none resize-none placeholder:text-gray-600 min-h-[100px]"
            placeholder="Pelo que você é grato agora?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 font-medium">Sua gratidão ganha +10 Fótons ⚛️</div>
            <button
              onClick={handlePost}
              disabled={!text.trim() || isPosting}
              className="bg-secondary text-text-primary font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isPosting ? 'Postando...' : <><Send size={18} /> Gratidão</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GratitudeCard = ({ entry, isLiked, onLike }: { entry: PublicEntry, isLiked: boolean, onLike: (id: string, authorId: string) => void }) => {
  const [showReward, setShowReward] = useState(false);

  const handleLikeClick = () => {
    if (!isLiked) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1000);
    }
    onLike(entry.id, entry.authorId);
  };

  return (
    <div className="bg-primary rounded-2xl border border-gray-800 hover:bg-white/[0.02] transition-colors overflow-hidden group">
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-gray-800 p-1.5 rounded-full">
            <User size={14} className="text-gray-400" />
          </div>
          <Link to={`/profile/${entry.authorId}`} className="text-sm font-bold text-text-secondary hover:text-secondary transition-colors">
            {entry.authorName}
          </Link>
          <span className="text-gray-600 text-xs">· {new Date(entry.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <p className="text-text-primary text-lg leading-relaxed mb-4 whitespace-pre-wrap">
          {entry.text}
        </p>

        <div className="flex items-center space-x-6 text-gray-500">
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={handleLikeClick} 
            className={`flex items-center space-x-2 relative transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-bold">{entry.likesCount || 0}</span>
            <AnimatePresence>
              {showReward && (
                <motion.div 
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -40 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 text-accent font-bold text-xs whitespace-nowrap pointer-events-none"
                >
                  +1 Fóton ⚛️
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <Link 
            to={`/post/${entry.id}`} 
            className="flex items-center space-x-2 hover:text-secondary transition-colors"
          >
            <MessageSquare size={18} />
            <span className="text-sm font-bold">{entry.commentsCount || 0}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Home = () => {
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [likedEntries, setLikedEntries] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { earnPhotons } = useUserProgressStore();

  const fetchPublicEntries = async () => {
    const q = query(collection(db, 'entries'), where('isPublic', '==', true), orderBy('timestamp', 'desc'), limit(15));
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
    
    setLikedEntries(prev => isLiked ? prev.filter(id => id !== entryId) : [...prev, entryId]);
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, likesCount: e.likesCount + (isLiked ? -1 : 1) } : e));

    if (!isLiked) {
      earnPhotons('like', authorId);
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
      fetchPublicEntries(); 
      fetchUserLikes();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8">
      <JourneySummary />
      
      {user && <GratitudeInput onPostSuccess={fetchPublicEntries} />}

      <div className="px-2 sm:px-0">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-text-primary">Gratidão em Destaque</h2>
          <Link to="/public-feed" className="text-secondary text-sm font-bold hover:underline">Ver tudo</Link>
        </div>
        
        <div className="space-y-4">
          {entries.map(entry => (
            <GratitudeCard 
              key={entry.id} 
              entry={entry} 
              isLiked={likedEntries.includes(entry.id)} 
              onLike={handleLike} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
