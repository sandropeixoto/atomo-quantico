import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, orderBy, runTransaction, where, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageSquare, ArrowLeft, User, ShieldAlert, EyeOff } from 'lucide-react';
import { useUserProgressStore } from '../stores/userProgressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ModerationModal } from '../components/ModerationModal';

interface Post {
  id: string;
  text: string;
  authorId: string;
  timestamp: { seconds: number; };
  authorName?: string;
  likesCount?: number;
  commentsCount?: number;
  status?: 'active' | 'hidden' | 'removed';
  moderationReason?: string;
}

interface Comment {
  id: string;
  text: string;
  authorId: string;
  timestamp: { seconds: number; };
  authorName?: string;
}

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { earnPhotons } = useUserProgressStore();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isModModalOpen, setIsModModalOpen] = useState(false);

  const fetchPostAndComments = async () => {
    if (!id) return;
    const postRef = doc(db, 'entries', id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = { id: postSnap.id, ...postSnap.data() } as Post;
      const userDocRef = doc(db, 'users', postData.authorId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        postData.authorName = userDoc.data().displayName || 'Anônimo';
      }
      setPost(postData);

      if (user) {
        const likeRef = doc(db, 'entries', id, 'likes', user.uid);
        const likeSnap = await getDoc(likeRef);
        setIsLiked(likeSnap.exists());
      }

      const commentsQuery = query(collection(db, 'entries', id, 'comments'), orderBy('timestamp', 'asc'));
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));

      const authorIds = [...new Set(commentsData.map(comment => comment.authorId))];
      if (authorIds.length > 0) {
        const usersQuery = query(collection(db, 'users'), where('__name__', 'in', authorIds));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {} as { [key: string]: any });

        commentsData.forEach(comment => {
          comment.authorName = usersData[comment.authorId]?.displayName || 'Anônimo';
        });
      }
      setComments(commentsData);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id, user]);

  const handleLike = async () => {
    if (isLiking || !post || post.status === 'hidden' || user?.status === 'blocked') return;
    if (!user) { navigate('/login'); return; }
    if (!id) return;
    setIsLiking(true);

    if (!isLiked) {
        earnPhotons('like', post.authorId);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 1000);
    }

    const postRef = doc(db, 'entries', id);
    const likeRef = doc(db, 'entries', id, 'likes', user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) throw "Error";
        const newLikesCount = (postDoc.data().likesCount || 0) + (isLiked ? -1 : 1);
        transaction.update(postRef, { likesCount: newLikesCount });
        if (isLiked) transaction.delete(likeRef);
        else transaction.set(likeRef, { userId: user.uid });
      });

      setIsLiked(!isLiked);
      setPost(prevPost => prevPost ? { ...prevPost, likesCount: (prevPost.likesCount || 0) + (isLiked ? -1 : 1) } : null);

    } catch (e) {
      console.error(e);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim() === '' || !user || !id || !post || user.status === 'blocked') return;

    earnPhotons('comment', post.authorId);

    const postRef = doc(db, 'entries', id);

    try {
        await runTransaction(db, async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists()) throw "Error";

            const newCommentsCount = (postDoc.data().commentsCount || 0) + 1;
            transaction.update(postRef, { commentsCount: newCommentsCount });
            
            const commentRef = doc(collection(db, 'entries', id, 'comments'));
            transaction.set(commentRef, {
                text: newComment,
                authorId: user.uid,
                timestamp: new Date(),
            });
        });

        setNewComment('');
        fetchPostAndComments();
    } catch (e) {
        console.error(e);
    }
  };

  const handleModerate = async (data: { status: 'active' | 'hidden' | 'removed'; reason: string; blockUser: boolean }) => {
    if (!post || !user || !id) return;

    try {
      const postRef = doc(db, 'entries', id);
      await updateDoc(postRef, {
        status: data.status,
        moderationReason: data.reason,
        moderatedBy: user.uid
      });

      if (data.blockUser) {
        const authorRef = doc(db, 'users', post.authorId);
        await updateDoc(authorRef, {
          status: 'blocked',
          blockedReason: data.reason
        });
      }

      setPost(prev => prev ? { ...prev, status: data.status, moderationReason: data.reason } : null);
    } catch (e) {
      console.error("Erro na moderação:", e);
    }
  };

  if (!post) {
    return <div className="text-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block">⚛️</motion.div></div>;
  }

  const isModerator = user?.role === 'admin' || user?.role === 'moderator';
  const isHidden = post.status === 'hidden';
  const isBlocked = user?.status === 'blocked';

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <ModerationModal
        isOpen={isModModalOpen}
        onClose={() => setIsModModalOpen(false)}
        onConfirm={handleModerate}
        targetType="post"
        authorName={post.authorName || 'Anônimo'}
        currentStatus={post.status}
      />
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-text-secondary hover:text-secondary mb-6 transition-colors p-2"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Voltar</span>
      </button>

      <div className={`bg-primary rounded-2xl shadow-lg overflow-hidden border ${isHidden ? 'border-red-900/30' : 'border-gray-800'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary/20 p-2 rounded-full">
                <User className="text-secondary" size={24} />
              </div>
              <div>
                <p className="font-bold text-text-primary">{post.authorName}</p>
                <p className="text-xs text-gray-400">{new Date(post.timestamp.seconds * 1000).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            {isModerator && (
              <button 
                onClick={() => setIsModModalOpen(true)}
                className={`p-2 rounded-lg transition-colors ${isHidden ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-secondary hover:text-white'}`}
              >
                <ShieldAlert size={20} />
              </button>
            )}
          </div>
          
          {isHidden && !isModerator ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center my-6">
              <EyeOff size={48} className="text-red-500/40 mx-auto mb-4" />
              <p className="text-red-200/60 font-medium">Esta postagem foi ocultada por moderação.</p>
              <p className="text-red-400/40 text-sm mt-1">Motivo: {post.moderationReason}</p>
            </div>
          ) : (
            <p className={`text-xl leading-relaxed mb-6 whitespace-pre-wrap ${isHidden ? 'text-red-200/40 italic' : 'text-text-primary'}`}>
              {isHidden && <span className="text-xs font-black uppercase tracking-tighter bg-red-500 text-white px-2 py-0.5 rounded mr-2">Oculto</span>}
              {post.text}
            </p>
          )}
          
          <div className="flex items-center space-x-8 py-4 border-t border-gray-800 text-text-secondary">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={handleLike} 
              disabled={isLiking} 
              className={`flex items-center space-x-2 relative ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <Heart fill={isLiked ? 'currentColor' : 'none'} size={22}/>
              <span className="font-bold">{post.likesCount || 0}</span>
              <AnimatePresence>
                {showReward && (
                  <motion.div 
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -40 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 text-accent font-bold"
                  >
                    +1 ⚛️
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <div className="flex items-center space-x-2">
              <MessageSquare size={22} />
              <span className="font-bold">{post.commentsCount || 0}</span>
            </div>
          </div>

          {/* Campo de Comentário estilo Twitter */}
          {user ? (
            isBlocked ? (
              <div className="mt-4 border-t border-red-900/20 pt-6 text-center">
                <div className="bg-red-500/10 rounded-xl p-4 inline-flex items-center gap-3">
                  <ShieldAlert size={18} className="text-red-400" />
                  <p className="text-red-400/80 text-sm font-bold uppercase tracking-tight">Interações Restritas: {user.blockedReason}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="mt-4 border-t border-gray-800 pt-4">
                <textarea
                  className="w-full bg-transparent text-text-primary text-lg focus:outline-none resize-none placeholder:text-gray-500"
                  rows={2}
                  placeholder="Postar sua resposta"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit" 
                    disabled={!newComment.trim()}
                    className="bg-secondary text-text-primary font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Responder
                  </button>
                </div>
              </form>
            )
          ) : (
            <p className="text-text-secondary text-center py-4 bg-gray-800/50 rounded-xl mt-4">
              Faça <Link to="/login" className="text-secondary font-semibold hover:underline">login</Link> para responder.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-0 border-t border-gray-800">
        <h2 className="text-xl font-bold text-text-primary p-4">Comentários</h2>
        {comments.map(comment => (
          <div key={comment.id} className="p-4 border-b border-gray-800 hover:bg-white/5 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="bg-gray-700 p-1.5 rounded-full mt-1">
                <User size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-text-primary text-sm">{comment.authorName}</span>
                  <span className="text-xs text-gray-500">· {new Date(comment.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-text-secondary mt-1">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-text-secondary text-center py-8">Ainda não há respostas. Seja o primeiro!</p>
        )}
      </div>
    </div>
  );
};

export default PostPage;
