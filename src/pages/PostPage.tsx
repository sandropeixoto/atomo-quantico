import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, runTransaction } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  text: string;
  authorId: string;
  timestamp: { seconds: number; };
  authorName?: string;
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
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const fetchPostAndComments = async () => {
    if (!id) return;
    const postRef = doc(db, 'entries', id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = { id: postSnap.id, ...postSnap.data() } as Post;
      const userRef = doc(db, 'users', postData.authorId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        postData.authorName = userSnap.data().displayName || 'Anônimo';
      }
      setPost(postData);

      const commentsQuery = query(collection(db, 'entries', id, 'comments'), orderBy('timestamp', 'asc'));
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));

      const authorIds = [...new Set(commentsData.map(comment => comment.authorId))];
      if (authorIds.length > 0) {
        const usersRef = collection(db, 'users');
        const usersQuery = query(usersRef, where('__name__', 'in', authorIds));
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
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim() === '' || !user || !id) return;

    const postRef = doc(db, 'entries', id);

    try {
        await runTransaction(db, async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists()) {
                throw "A publicação não existe!";
            }

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
        fetchPostAndComments(); // Refresh comments
    } catch (e) {
        console.error("Erro na transação do comentário: ", e);
    }
  };

  if (!post) {
    return <div className="text-center py-20">Carregando...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-background rounded-2xl shadow-lg p-8 mb-8">
        <p className="text-sm text-gray-400 mb-2">Postado por {post.authorName} em {new Date(post.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</p>
        <p className="text-text-secondary text-lg leading-relaxed">{post.text}</p>
      </div>

      <div className="bg-background rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Comentários</h2>
        <div className="space-y-6 mb-8">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {/* You can add user avatars here later */}
              </div>
              <div className="flex-1">
                <p className="text-text-secondary mb-1"><span className="font-semibold text-text-primary">{comment.authorName}</span>: {comment.text}</p>
                <p className="text-xs text-gray-400">{new Date(comment.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-text-secondary">Seja o primeiro a comentar!</p>}
        </div>

        {user && (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-secondary focus:outline-none transition-shadow"
              rows={3}
              placeholder="Adicione um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="bg-secondary text-text-primary font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity mt-4">
              Comentar
            </button>
          </form>
        )}
        {!user && <p className="text-text-secondary">Você precisa estar logado para comentar.</p>}
      </div>
    </div>
  );
};

export default PostPage;
