import { create } from 'zustand';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../services/firebase';

// --- CONFIGURAÇÕES DE GAMEFICAÇÃO ---
const POINTS_PER_LIKE = 1;
const POINTS_PER_COMMENT = 3;
const POINTS_PER_ENTRY = 10; // Aumentado para valorizar o hábito
const POINTS_PER_RECEIVED_LIKE = 2; // Novo: Recompensa por inspirar outros

const levels = [
  { level: 1, name: 'Observador Quântico', minPhotons: 0 },
  { level: 2, name: 'Partícula Emergente', minPhotons: 30 },
  { level: 3, name: 'Núcleo Estável', minPhotons: 80 },
  { level: 4, name: 'Viajante Cósmico', minPhotons: 200 },
  { level: 5, name: 'Explorador Galáctico', minPhotons: 500 },
  { level: 6, name: 'Mestre da Coerência', minPhotons: 1000 },
  { level: 7, name: 'Entidade de Luz', minPhotons: 2500 },
];

// --- TIPOS E INTERFACES ---
interface LevelInfo {
  level: number;
  levelName: string;
  progress: number;
  entropyStatus: string;
}

interface UserProgressState {
  userId: string | null;
  photons: number;
  level: number;
  levelName: string;
  progress: number;
  entropyStatus: string;
  currentStreak: number;
  longestStreak: number;
  lastPostedDate: string | null;
  isInitialized: boolean; // Flag para saber se os dados já foram carregados
  fetchUserProgress: (uid: string) => Promise<void>;
  earnPhotons: (action: 'like' | 'comment' | 'create_entry', postAuthorId?: string) => Promise<void>;
  clearUserProgress: () => void;
}

// --- LÓGICA AUXILIAR ---
const calculateLevel = (photons: number): LevelInfo => {
  const currentLevelInfo = levels.slice().reverse().find(l => photons >= l.minPhotons) || levels[0];
  const nextLevelInfo = levels.find(l => l.level === currentLevelInfo.level + 1);

  let entropyStatus = 'Alta Entropia';
  if (currentLevelInfo.level >= 3) entropyStatus = 'Coerência Quântica';
  else if (currentLevelInfo.level === 2) entropyStatus = 'Estado Estacionário';

  if (nextLevelInfo) {
    const photonsInCurrentLevel = photons - currentLevelInfo.minPhotons;
    const photonsForNextLevel = nextLevelInfo.minPhotons - currentLevelInfo.minPhotons;
    const progress = (photonsInCurrentLevel / photonsForNextLevel) * 100;
    return { level: currentLevelInfo.level, levelName: currentLevelInfo.name, progress: Math.min(progress, 100), entropyStatus };
  }

  return { level: currentLevelInfo.level, levelName: currentLevelInfo.name, progress: 100, entropyStatus }; // Nível máximo
};

const getInitialState = () => ({
  userId: null,
  photons: 0,
  level: 1,
  levelName: 'Observador Quântico',
  progress: 0,
  entropyStatus: 'Alta Entropia',
  currentStreak: 0,
  longestStreak: 0,
  lastPostedDate: null,
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
      const currentStreak = data.currentStreak || 0;
      const longestStreak = data.longestStreak || 0;
      const lastPostedDate = data.lastPostedDate || null;
      const { level, levelName, progress, entropyStatus } = calculateLevel(photons);
      set({
        userId: uid,
        photons,
        level,
        levelName,
        progress,
        entropyStatus,
        currentStreak,
        longestStreak,
        lastPostedDate,
        isInitialized: true
      });
    } else {
      // Se o usuário não tem um documento, o criamos com valores iniciais
      await runTransaction(db, async (transaction) => {
        transaction.set(userRef, {
          photons: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastPostedDate: null
        });
      });
      set({ ...getInitialState(), userId: uid, isInitialized: true });
    }
  },

  // 2. Adiciona fótons, SALVA no Firestore e atualiza o estado
  earnPhotons: async (action, postAuthorId) => {
    const uid = get().userId;
    if (!uid) return;
    if (action !== 'create_entry' && uid === postAuthorId) return;

    let points = 0;
    if (action === 'like') points = POINTS_PER_LIKE;
    else if (action === 'comment') points = POINTS_PER_COMMENT;
    else if (action === 'create_entry') points = POINTS_PER_ENTRY;

    if (points === 0) return;

    const userRef = doc(db, 'users', uid);
    const authorRef = postAuthorId ? doc(db, 'users', postAuthorId) : null;

    try {
      await runTransaction(db, async (transaction) => {
        // 1. Crédito para quem realizou a ação
        const userDoc = await transaction.get(userRef);
        const currentPhotons = userDoc.exists() ? (userDoc.data().photons || 0) : 0;
        const newPhotons = currentPhotons + points;

        // Lógica de Streak (mantida)
        let newStreak = userDoc.exists() ? (userDoc.data().currentStreak || 0) : 0;
        let newLongestStreak = userDoc.exists() ? (userDoc.data().longestStreak || 0) : 0;
        let newLastPostedDate = userDoc.exists() ? (userDoc.data().lastPostedDate || null) : null;

        if (action === 'create_entry') {
          const today = new Date().toISOString().split('T')[0];
          const lastPosted = newLastPostedDate;
          if (lastPosted !== today) {
            if (lastPosted) {
              const lastDate = new Date(lastPosted);
              const currentDate = new Date(today);
              const diffDays = Math.ceil(Math.abs(currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
              newStreak = diffDays === 1 ? newStreak + 1 : 1;
            } else {
              newStreak = 1;
            }
            newLastPostedDate = today;
            if (newStreak > newLongestStreak) newLongestStreak = newStreak;
          }
        }

        transaction.set(userRef, {
          photons: newPhotons,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastPostedDate: newLastPostedDate
        }, { merge: true });

        // 2. [NOVO] Crédito para o autor do post ao receber like/comentário
        if (authorRef && (action === 'like' || action === 'comment')) {
          const authorDoc = await transaction.get(authorRef);
          if (authorDoc.exists()) {
            const authorPhotons = authorDoc.data().photons || 0;
            const reward = action === 'like' ? POINTS_PER_RECEIVED_LIKE : POINTS_PER_COMMENT; // Autor ganha bem se comentarem
            transaction.update(authorRef, { photons: authorPhotons + reward });
          }
        }

        // Atualiza estado local
        const { level, levelName, progress, entropyStatus } = calculateLevel(newPhotons);
        set({
          photons: newPhotons,
          level,
          levelName,
          progress,
          entropyStatus,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastPostedDate: newLastPostedDate
        });
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
