import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, runTransaction, collectionGroup, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useUserProgressStore } from '../stores/userProgressStore';
import { GratitudeCard } from './Home';
import type { PublicEntry } from './Home';
import { ModerationModal } from '../components/ModerationModal';

const PublicFeed = () => {
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [likedEntries, setLikedEntries] = useState<string[]>([]);
  const [isModModalOpen, setIsModModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PublicEntry | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { earnPhotons } = useUserProgressStore();

  const fetchPublicEntries = async () => {
    const q = query(collection(db, 'entries'), where('isPublic', '==', true), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const publicEntriesData: PublicEntry[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    const authorIds = [...new Set(publicEntriesData.map(entry => entry.authorId))];
    if (authorIds.length === 0) return;
    const usersRef = collection(db, 'users');
    const usersData: Record<string, any> = {};
    for (let i = 0; i < authorIds.length; i += 10) {
      const chunk = authorIds.slice(i, i + 10);
      const usersQuery = query(usersRef, where('__name__', 'in', chunk));
      const usersSnapshot = await getDocs(usersQuery);
      usersSnapshot.docs.forEach(doc => usersData[doc.id] = doc.data());
    }
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
    
    // UI Otimista
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

  const handleModerate = (entry: PublicEntry) => {
    setSelectedEntry(entry);
    setIsModModalOpen(true);
  };

  const confirmModeration = async (data: { status: 'active' | 'hidden' | 'removed'; reason: string; blockUser: boolean }) => {
    if (!selectedEntry || !user) return;

    try {
      const entryRef = doc(db, 'entries', selectedEntry.id);
      await updateDoc(entryRef, {
        status: data.status,
        moderationReason: data.reason,
        moderatedBy: user.uid
      });

      if (data.blockUser) {
        const authorRef = doc(db, 'users', selectedEntry.authorId);
        await updateDoc(authorRef, {
          status: 'blocked',
          blockedReason: data.reason
        });
      }

      setEntries(prev => prev.map(e => e.id === selectedEntry.id ? { ...e, status: data.status, moderationReason: data.reason } : e));
      setSelectedEntry(null);
    } catch (e) {
      console.error("Erro na moderação:", e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      {selectedEntry && (
        <ModerationModal
          isOpen={isModModalOpen}
          onClose={() => setIsModModalOpen(false)}
          onConfirm={confirmModeration}
          targetType="post"
          authorName={selectedEntry.authorName || 'Anônimo'}
          currentStatus={selectedEntry.status}
        />
      )}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Feed Quântico</h1>
          <p className="text-text-secondary text-sm">Gratidão compartilhada pela comunidade</p>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <GratitudeCard 
            key={entry.id} 
            entry={entry} 
            isLiked={likedEntries.includes(entry.id)} 
            onLike={handleLike} 
            onModerate={handleModerate}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicFeed;
