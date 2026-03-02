import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Shield, ShieldAlert, Save, CheckCircle2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserService {
  name: string;
  url: string;
  isActive: boolean;
}

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

  const [services, setServices] = useState<UserService[]>([]);
  const [knownServices, setKnownServices] = useState<string[]>([]);

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
          setServices(data.services || []);
        }

        // Buscar nomes de serviços conhecidos para o autocomplete
        const metaRef = doc(db, 'metadata', 'services');
        const metaSnap = await getDoc(metaRef);
        if (metaSnap.exists()) {
          setKnownServices(metaSnap.data().knownNames || []);
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
        photons: Number(formData.photons),
        services: services.filter(s => s.name.trim() !== '') // Salva apenas serviços com nome
      });

      // Atualizar lista global de nomes de serviços (autocomplete)
      const newNames = services.map(s => s.name.trim()).filter(name => name !== '' && !knownServices.includes(name));
      if (newNames.length > 0) {
        const updatedKnownNames = [...new Set([...knownServices, ...newNames])];
        const metaRef = doc(db, 'metadata', 'services');
        await updateDoc(metaRef, { knownNames: updatedKnownNames }).catch(async () => {
          // Se o documento não existir, tenta criar (embora o ideal seja via console ou script inicial)
          const { setDoc } = await import('firebase/firestore');
          await setDoc(metaRef, { knownNames: updatedKnownNames });
        });
        setKnownServices(updatedKnownNames);
      }
      
      setMessage({ type: 'success', text: 'Parâmetros atualizados no campo quântico!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: 'error', text: 'Falha na sincronização dos dados.' });
    } finally {
      setSaving(false);
    }
  };

  const addServiceRow = () => {
    setServices([...services, { name: '', url: '', isActive: true }]);
  };

  const removeServiceRow = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof UserService, value: any) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setServices(newServices);
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

          {/* Gestão de Serviços */}
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondary">Serviços Adquiridos</label>
              <button
                type="button"
                onClick={addServiceRow}
                className="flex items-center gap-1 text-[10px] font-black uppercase bg-secondary/20 text-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/30 transition-all"
              >
                <Plus size={14} /> Adicionar Linha
              </button>
            </div>

            <div className="overflow-x-auto bg-black/20 rounded-2xl border border-gray-800">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-secondary">
                    <th className="px-4 py-3">Serviço</th>
                    <th className="px-4 py-3">Link de Acesso</th>
                    <th className="px-4 py-3 text-center w-20">Ativo</th>
                    <th className="px-4 py-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {services.map((service, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-2 py-2">
                        <input
                          list="known-services"
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          placeholder="Ex: Mentoria"
                          className="w-full bg-transparent border-none focus:ring-0 text-text-primary placeholder:text-gray-700 text-sm focus:outline-none"
                        />
                        <datalist id="known-services">
                          {knownServices.map(name => <option key={name} value={name} />)}
                        </datalist>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={service.url}
                            onChange={(e) => updateService(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-transparent border-none focus:ring-0 text-secondary text-xs font-mono focus:outline-none"
                          />
                          {service.url && (
                            <a href={service.url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white shrink-0">
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={service.isActive}
                          onChange={(e) => updateService(index, 'isActive', e.target.checked)}
                          className="w-5 h-5 rounded bg-black border-gray-700 text-secondary focus:ring-secondary"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeServiceRow(index)}
                          className="text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-text-secondary text-xs italic opacity-50">
                        Nenhum serviço atrelado a este viajante.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
