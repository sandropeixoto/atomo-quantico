import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, orderBy, runTransaction, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageSquare } from 'lucide-react';
import { useUserProgressStore } from '../stores/userProgressStore';

interface Post {
  id: string;
  text: string;
  authorId: string;
  timestamp: { seconds: number; };
  authorName?: string;
  likesCount?: number;
  commentsCount?: number;
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
    if (isLiking || !post) return;
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
    if (newComment.trim() === '' || !user || !id || !post) return;

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


  if (!post) {
    return <div className="text-center py-20">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="bg-background rounded-2xl shadow-lg p-8 mb-8">
        <p className="text-sm text-gray-400 mb-2">Postado por {post.authorName} em {new Date(post.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</p>
        <p className="text-text-secondary text-lg leading-relaxed">{post.text}</p>
        <div className="flex items-center space-x-4 mt-6 text-text-secondary">
          <button onClick={handleLike} disabled={isLiking} className={`flex items-center space-x-2 relative ${isLiked ? 'text-red-500' : ''}`}>
            <Heart fill={isLiked ? 'currentColor' : 'none'} size={22}/>
            <span>{post.likesCount || 0}</span>
            {showReward && <div className="reward-animation">+1 ⚛️</div>}
          </button>
          <div className="flex items-center space-x-2">
            <MessageSquare size={22} />
            <span>{post.commentsCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Comentários</h2>
        <div className="space-y-6 mb-8">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-4">
              <div className="flex-1">
                <p className="text-text-secondary mb-1"><span className="font-semibold text-text-primary">{comment.authorName}</span>: {comment.text}</p>
                <p className="text-xs text-gray-400">{new Date(comment.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-text-secondary">Seja o primeiro a comentar!</p>}
        </div>

        {user ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              className="w-full p-4 border rounded-lg bg-primary text-text-primary border-gray-700 focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow placeholder:text-gray-400"
              rows={3}
              placeholder="Adicione um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="bg-secondary text-text-primary font-semibold py-2 px-6 rounded-full hover:opacity-90 transition-opacity mt-4">Comentar</button>
          </form>
        ) : (
          <p className="text-text-secondary text-center py-4 bg-gray-800 rounded-lg">Faça <Link to="/login" className="text-secondary font-semibold hover:underline">login</Link> para curtir ou comentar.</p>
        )}
      </div>
       <style>{`
        .reward-animation { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); animation: floatUp 1s ease-out forwards; font-size: 1.2rem; font-weight: bold; color: #ef4444; }
        @keyframes floatUp { 0% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, -50px); } }
    `}</style>
    </div>
  );
};

export default PostPage;
