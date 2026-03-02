import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { User, Shield, ShieldAlert, UserX, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserListItem {
  id: string;
  displayName: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'blocked';
  photons: number;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any)
        })) as UserListItem[];
        setUsers(usersData);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-secondary font-bold uppercase tracking-widest text-xs">Mapeando rede neural...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary uppercase italic tracking-tighter flex items-center gap-3">
            <User className="text-secondary" size={32} />
            Gestão de Usuários
          </h1>
          <p className="text-text-secondary text-sm mt-1">Controle de acesso e moderação da comunidade.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
            className="bg-primary/40 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/[0.05] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <User size={24} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-text-primary font-bold">{user.displayName || 'Sem Nome'}</h3>
                <p className="text-text-secondary text-xs">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-xs font-black text-secondary uppercase tracking-widest">{user.photons || 0} Fótons</p>
                <div className="flex gap-2 mt-1">
                  {user.role === 'admin' && (
                    <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                      <Shield size={10} /> Admin
                    </span>
                  )}
                  {user.role === 'moderator' && (
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                      <ShieldAlert size={10} /> Mod
                    </span>
                  )}
                  {user.status === 'blocked' && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                      <UserX size={10} /> Bloqueado
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="text-gray-600 group-hover:text-secondary group-hover:translate-x-1 transition-all" size={20} />
            </div>
          </motion.div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-gray-800">
            <p className="text-text-secondary italic">Nenhum usuário encontrado para esta busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}
