import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [uf, setUf] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setDisplayName(data.displayName || '');
          setGender(data.gender || '');
          setBirthDate(data.birthDate || '');
          setUf(data.uf || '');
        }
        setLoading(false);
      };
      fetchUserData();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, {
        displayName,
        gender,
        birthDate,
        uf
      }, { merge: true });
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar o perfil: ", error);
      setMessage('Erro ao atualizar o perfil. Tente novamente.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Carregando perfil...</div>;
  }

  const isBlocked = user?.status === 'blocked';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {isBlocked && (
        <div className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="bg-red-500 p-3 rounded-full text-white shadow-lg shadow-red-900/20">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-400 uppercase tracking-tight">Sua conta possui restrições</h2>
            <p className="text-text-secondary text-sm">
              Motivo: <span className="text-red-400/80 font-bold">{user.blockedReason || 'Violação das diretrizes'}</span>
            </p>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-text-primary mb-6">Meu Perfil</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-text-secondary mb-1">Nome de Exibição</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-background border border-gray-600 rounded-md p-2 text-text-primary focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-text-secondary mb-1">Data de Nascimento</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-background border border-gray-600 rounded-md p-2 text-text-primary focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-text-secondary mb-1">Gênero</label>
          <select 
            id="gender" 
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-background border border-gray-600 rounded-md p-2 text-text-primary focus:ring-secondary focus:border-secondary"
          >
            <option value="">Prefiro não informar</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        <div>
          <label htmlFor="uf" className="block text-sm font-medium text-text-secondary mb-1">UF</label>
          <select 
            id="uf" 
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="w-full bg-background border border-gray-600 rounded-md p-2 text-text-primary focus:ring-secondary focus:border-secondary"
          >
            <option value="">Selecione seu estado</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-secondary text-text-primary font-semibold py-2 px-6 rounded-full hover:opacity-90 transition-all">
          Salvar Alterações
        </button>
        {message && <p className="text-sm text-green-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default Profile;
