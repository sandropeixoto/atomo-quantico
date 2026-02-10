import { create } from 'zustand';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../services/firebase';

// --- CONFIGURAÇÕES DE GAMEFICAÇÃO ---
const POINTS_PER_LIKE = 1;
const POINTS_PER_COMMENT = 3;
const POINTS_PER_ENTRY = 5; // Recompensa por criar uma nova entrada de gratidão

const levels = [
  { level: 1, name: 'Observador Quântico', minPhotons: 0 },
  { level: 2, name: 'Partícula Emergente', minPhotons: 20 },
  { level: 3, name: 'Viajante Cósmico', minPhotons: 50 },
  { level: 4, name: 'Explorador Galáctico', minPhotons: 100 },
  { level: 5, name: 'Mestre do Universo', minPhotons: 250 },
];

// --- TIPOS E INTERFACES ---
interface LevelInfo {
  level: number;
  levelName: string;
  progress: number;
}

interface UserProgressState {
  userId: string | null;
  photons: number;
  level: number;
  levelName: string;
  progress: number;
  isInitialized: boolean; // Flag para saber se os dados já foram carregados
  fetchUserProgress: (uid: string) => Promise<void>;
  earnPhotons: (action: 'like' | 'comment' | 'create_entry', postAuthorId?: string) => Promise<void>;
  clearUserProgress: () => void;
}

// --- LÓGICA AUXILIAR ---
const calculateLevel = (photons: number): LevelInfo => {
  const currentLevelInfo = levels.slice().reverse().find(l => photons >= l.minPhotons) || levels[0];
  const nextLevelInfo = levels.find(l => l.level === currentLevelInfo.level + 1);

  if (nextLevelInfo) {
    const photonsInCurrentLevel = photons - currentLevelInfo.minPhotons;
    const photonsForNextLevel = nextLevelInfo.minPhotons - currentLevelInfo.minPhotons;
    const progress = (photonsInCurrentLevel / photonsForNextLevel) * 100;
    return { level: currentLevelInfo.level, levelName: currentLevelInfo.name, progress: Math.min(progress, 100) };
  }

  return { level: currentLevelInfo.level, levelName: currentLevelInfo.name, progress: 100 }; // Nível máximo
};

const getInitialState = () => ({
    userId: null,
    photons: 0,
    level: 1,
    levelName: 'Observador Quântico',
    progress: 0,
    isInitialized: false,
});

// --- CRIAÇÃO DA STORE (ZUSTAND) ---
export const useUserProgressStore = create<UserProgressState>((set, get) => ({
  ...getInitialState(),

  // 1. Busca os dados do Firestore e inicializa a store
  fetchUserProgress: async (uid: string) => {
    if (get().isInitialized && get().userId === uid) return; // Já inicializado para este usuário

    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const photons = data.photons || 0;
      const { level, levelName, progress } = calculateLevel(photons);
      set({ userId: uid, photons, level, levelName, progress, isInitialized: true });
    } else {
      // Se o usuário não tem um documento, o criamos com valores iniciais
      await runTransaction(db, async (transaction) => {
          transaction.set(userRef, { photons: 0, streak: 0, lastEntryDate: null });
      });
      set({ ...getInitialState(), userId: uid, isInitialized: true });
    }
  },

  // 2. Adiciona fótons, SALVA no Firestore e atualiza o estado
  earnPhotons: async (action, postAuthorId) => {
    const uid = get().userId;
    if (!uid) return; // Não faz nada se não houver usuário logado
    if (action !== 'create_entry' && uid === postAuthorId) return; // Não ganha pontos ao interagir com os próprios posts

    let points = 0;
    if (action === 'like') points = POINTS_PER_LIKE;
    else if (action === 'comment') points = POINTS_PER_COMMENT;
    else if (action === 'create_entry') points = POINTS_PER_ENTRY;

    if (points === 0) return;

    const userRef = doc(db, 'users', uid);
    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const currentPhotons = userDoc.exists() ? userDoc.data().photons || 0 : 0;
        const newPhotons = currentPhotons + points;
        
        transaction.set(userRef, { photons: newPhotons }, { merge: true });
        
        // Após a transação, atualiza o estado local
        const { level, levelName, progress } = calculateLevel(newPhotons);
        set({ photons: newPhotons, level, levelName, progress });
      });
    } catch (error) {
      console.error("Erro ao conceder fótons: ", error);
    }
  },

  // 3. Limpa o estado no logout
  clearUserProgress: () => {
    set(getInitialState());
  },
}));
