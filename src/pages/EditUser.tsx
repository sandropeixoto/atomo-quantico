import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Shield, ShieldAlert, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EditUser() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    role: 'user' as 'user' | 'moderator' | 'admin',
    status: 'active' as 'active' | 'blocked',
    blockedReason: '',
    photons: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFormData({
            displayName: data.displayName || '',
            email: data.email || '',
            role: data.role || 'user',
            status: data.status || 'active',
            blockedReason: data.blockedReason || '',
            photons: data.photons || 0,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    
    setSaving(true);
    setMessage(null);

    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        role: formData.role,
        status: formData.status,
        blockedReason: formData.status === 'blocked' ? formData.blockedReason : '',
        photons: Number(formData.photons)
      });
      
      setMessage({ type: 'success', text: 'Parâmetros atualizados no campo quântico!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: 'error', text: 'Falha na sincronização dos dados.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-secondary font-bold uppercase tracking-widest text-xs">Acessando registros...</p>
      </div>
    );
  }

  const isSelf = currentUser?.uid === uid;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate('/admin/users')} 
        className="flex items-center gap-2 text-text-secondary hover:text-secondary mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-xs">Voltar para Lista</span>
      </button>

      <div className="bg-primary rounded-3xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shrink-0">
            <User size={32} className="text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary uppercase italic tracking-tighter">Editar Usuário</h1>
            <p className="text-text-secondary text-xs">{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <CheckCircle2 size={18} />
                <p className="text-sm font-bold">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-secondary">Nome de Exibição</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="w-full bg-black/30 border border-gray-800 rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-secondary">Fótons (Energia)</label>
              <input
                type="number"
                value={formData.photons}
                onChange={(e) => setFormData({...formData, photons: Number(e.target.value)})}
                className="w-full bg-black/30 border border-gray-800 rounded-xl py-3 px-4 text-secondary font-bold focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
          </div>

          {/* Perfil / Role */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="text-xs font-black uppercase tracking-widest text-text-secondary block mb-2">Permissão de Acesso</label>
            <div className="grid grid-cols-3 gap-3">
              {(['user', 'moderator', 'admin'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  disabled={isSelf && role !== 'admin'}
                  onClick={() => setFormData({...formData, role})}
                  className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all flex flex-col items-center gap-2 ${
                    formData.role === role 
                      ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20' 
                      : 'bg-black/20 border-gray-800 text-text-secondary hover:border-gray-600'
                  } ${isSelf && role !== 'admin' ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {role === 'admin' ? <Shield size={16} /> : role === 'moderator' ? <ShieldAlert size={16} /> : <User size={16} />}
                  {role}
                </button>
              ))}
            </div>
            {isSelf && <p className="text-[10px] text-yellow-500 italic">Você não pode remover seu próprio acesso administrativo.</p>}
          </div>

          {/* Status / Bloqueio */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="text-xs font-black uppercase tracking-widest text-text-secondary block mb-2">Estado da Conta</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, status: 'active'})}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                  formData.status === 'active' 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                    : 'bg-black/20 border-gray-800 text-text-secondary hover:border-gray-600'
                }`}
              >
                Ativo
              </button>
              <button
                type="button"
                disabled={isSelf}
                onClick={() => setFormData({...formData, status: 'blocked'})}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                  formData.status === 'blocked' 
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20' 
                    : 'bg-black/20 border-gray-800 text-text-secondary hover:border-gray-600'
                } ${isSelf ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                Bloqueado
              </button>
            </div>
          </div>

          {formData.status === 'blocked' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 bg-red-500/5 p-4 rounded-2xl border border-red-500/20"
            >
              <label className="text-xs font-black uppercase tracking-widest text-red-400">Motivo do Bloqueio</label>
              <textarea
                value={formData.blockedReason}
                onChange={(e) => setFormData({...formData, blockedReason: e.target.value})}
                placeholder="Ex: Spam, Conteúdo Impróprio..."
                rows={2}
                className="w-full bg-black/40 border border-red-500/20 rounded-xl py-3 px-4 text-red-200 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </motion.div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-white text-gray-900 font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
