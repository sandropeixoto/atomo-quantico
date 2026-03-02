import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, getDoc, collectionGroup, runTransaction } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Award, Zap } from 'lucide-react';
import { GratitudeCard } from './Home';
import type { PublicEntry } from './Home';
import { useUserProgressStore } from '../stores/userProgressStore';
import { ModerationModal } from '../components/ModerationModal';

interface UserData {
  displayName: string;
  photoURL?: string;
  photons: number;
  level: number;
  levelName: string;
  role?: string;
  status?: string;
  blockedReason?: string;
}

export function PublicProfile() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { earnPhotons } = useUserProgressStore();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [likedEntries, setLikedEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Moderação
  const [isModModalOpen, setIsModModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PublicEntry | null>(null);

  const fetchData = async () => {
    if (!uid) return;
    setLoading(true);
    try {
      // 1. Buscar dados do usuário
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData({
          displayName: data.displayName || 'Anônimo',
          photoURL: data.photoURL,
          photons: data.photons || 0,
          level: data.level || 1,
          levelName: data.levelName || 'Observador Quântico',
          role: data.role,
          status: data.status,
          blockedReason: data.blockedReason
        });
      }

      // 2. Buscar posts públicos do usuário
      const q = query(
        collection(db, 'entries'), 
        where('authorId', '==', uid), 
        where('isPublic', '==', true),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const publicEntriesData: PublicEntry[] = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        authorName: userSnap.data()?.displayName || 'Anônimo',
        ...(doc.data() as any) 
      }));
      setEntries(publicEntriesData);

      // 3. Buscar curtidas do usuário atual para marcar os cards
      if (currentUser) {
        const likesQuery = query(collectionGroup(db, 'likes'), where('userId', '==', currentUser.uid));
        const likesSnapshot = await getDocs(likesQuery);
        const likedEntryIds = likesSnapshot.docs.map(doc => doc.ref.parent.parent!.id);
        setLikedEntries(likedEntryIds);
      }
    } catch (error) {
      console.error("Erro ao buscar perfil público:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [uid, currentUser]);

  const handleLike = async (entryId: string, authorId: string) => {
    if (!currentUser) { navigate('/login'); return; }
    const isLiked = likedEntries.includes(entryId);
    
    setLikedEntries(prev => isLiked ? prev.filter(id => id !== entryId) : [...prev, entryId]);
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, likesCount: (e.likesCount || 0) + (isLiked ? -1 : 1) } : e));

    if (!isLiked) {
      earnPhotons('like', authorId);
    }
    
    const entryRef = doc(db, 'entries', entryId);
    const likeRef = doc(db, 'entries', entryId, 'likes', currentUser.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const entryDoc = await transaction.get(entryRef);
        if (!entryDoc.exists()) throw "Error";
        const newLikesCount = (entryDoc.data().likesCount || 0) + (isLiked ? -1 : 1);
        transaction.update(entryRef, { likesCount: newLikesCount });
        if (isLiked) transaction.delete(likeRef);
        else transaction.set(likeRef, { userId: currentUser.uid });
      });
    } catch (e) { 
      console.error(e);
      fetchData(); 
    }
  };

  const handleModerate = (entry: PublicEntry) => {
    setSelectedEntry(entry);
    setIsModModalOpen(true);
  };

  const confirmModeration = async (data: { status: 'active' | 'hidden' | 'removed'; reason: string; blockUser: boolean }) => {
    if (!selectedEntry || !currentUser) return;
    try {
      const entryRef = doc(db, 'entries', selectedEntry.id);
      await runTransaction(db, async (transaction) => {
        transaction.update(entryRef, {
          status: data.status,
          moderationReason: data.reason,
          moderatedBy: currentUser.uid
        });
      });
      setEntries(prev => prev.map(e => e.id === selectedEntry.id ? { ...e, status: data.status, moderationReason: data.reason } : e));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-secondary animate-pulse uppercase tracking-widest text-xs font-bold">Sintonizando Frequência...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-text-primary">Usuário não encontrado</h2>
        <p className="text-text-secondary mt-2">Este perfil pode ter sido removido ou não existe.</p>
        <button onClick={() => navigate(-1)} className="mt-6 text-secondary font-bold flex items-center gap-2 mx-auto">
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {selectedEntry && (
        <ModerationModal
          isOpen={isModModalOpen}
          onClose={() => setIsModModalOpen(false)}
          onConfirm={confirmModeration}
          targetType="post"
          authorName={userData.displayName}
          currentStatus={selectedEntry.status}
        />
      )}

      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-secondary hover:text-secondary mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-xs">Voltar</span>
      </button>

      {/* Header do Perfil */}
      <div className="bg-primary rounded-3xl border border-gray-800 p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center border-2 border-secondary/30">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt={userData.displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={40} className="text-secondary" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent p-2 rounded-full shadow-lg">
              <Award size={16} className="text-primary" />
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-black text-text-primary uppercase italic tracking-tight">
              {userData.displayName}
            </h1>
            <p className="text-accent font-bold uppercase tracking-[0.2em] text-xs mt-1">
              {userData.levelName} • Nível {userData.level}
            </p>
            {userData.status === 'blocked' && (
              <span className="inline-block mt-2 bg-red-500/20 text-red-400 text-[10px] font-black uppercase px-2 py-1 rounded border border-red-500/30">
                Conta Restrita
              </span>
            )}
          </div>

          <div className="bg-black/20 rounded-2xl p-4 border border-white/5 text-center min-w-[120px]">
            <p className="text-secondary text-2xl font-black">{userData.photons}</p>
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Fótons ⚛️</p>
          </div>
        </div>
      </div>

      {/* Posts Públicos */}
      <div>
        <h2 className="text-xl font-black text-text-primary uppercase tracking-widest mb-6 flex items-center gap-3 italic">
          <Zap size={20} className="text-secondary" />
          Memórias Públicas
        </h2>

        <div className="space-y-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <GratitudeCard 
                key={entry.id} 
                entry={entry} 
                isLiked={likedEntries.includes(entry.id)} 
                onLike={handleLike} 
                onModerate={handleModerate}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-dashed border-gray-800">
              <p className="text-text-secondary italic">Este viajante ainda não compartilhou memórias públicas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
