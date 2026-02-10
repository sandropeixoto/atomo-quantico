import { create } from 'zustand';
import { doc, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Caminho corrigido

const POINTS_PER_ENTRY = 10;
const PHOTONS_PER_LEVEL = 100;

// --- Definição dos Status de Entropia ---
const ENTROPY_STATUS = {
  HIGH: 'Alta Entropia',          // streak = 0-2
  STATIONARY: 'Estado Estacionário', // streak = 3-6
  COHERENCE: 'Coerência Quântica'  // streak >= 7
};

// --- Definição dos Badges ---
const BADGES = {
  OBSERVER: 'Observador (Bronze)', // 7 anotações
  COHERENT: 'Coerente (Prata)',    // 7 dias de streak
  RESONANCE: 'Ressonância (Ouro)'   // 50 de impacto
};

// --- Definição das Recompensas de Interação ---
const REWARDS = {
  LIKE: { giver: 1, receiver: 2 },
  COMMENT: { giver: 5, receiver: 5 }
};

const IMPACT_THRESHOLDS = {
    RESONANCE: 50,
}

interface UserProgressState {
  photons: number;
  streak: number;
  level: number;
  entropyStatus: string;
  lastEntryDate: string | null;
  badges: string[];
  totalEntries: number;
  impactScore: number; // Novo estado para "Impacto"
  addGratitudeEntry: () => void;
  interactWithPost: (interactionType: 'like' | 'comment', authorId: string) => Promise<void>; // Nova ação
}

const isConsecutiveDay = (lastDate: string, newDate: Date) => {
  const last = new Date(lastDate);
  const nextDay = new Date(last);
  nextDay.setDate(last.getDate() + 1);
  return newDate.toDateString() === nextDay.toDateString();
};

const isSameDay = (lastDate: string, newDate: Date) => {
  return new Date(lastDate).toDateString() === newDate.toDateString();
};

const getEntropyStatus = (streak: number): string => {
  if (streak >= 7) return ENTROPY_STATUS.COHERENCE;
  if (streak >= 3) return ENTROPY_STATUS.STATIONARY;
  return ENTROPY_STATUS.HIGH;
}

export const useUserProgressStore = create<UserProgressState>((set, get) => ({
  photons: 0,
  streak: 0,
  level: 1,
  entropyStatus: ENTROPY_STATUS.HIGH,
  lastEntryDate: null,
  badges: [],
  totalEntries: 0,
  impactScore: 0,

  addGratitudeEntry: () => {
    // ... (lógica existente, sem alterações)
  },

  interactWithPost: async (interactionType: 'like' | 'comment', authorId: string) => {
    const reward = interactionType === 'like' ? REWARDS.LIKE : REWARDS.COMMENT;

    // 1. Atualiza o estado local do usuário ativo (quem interage)
    set(state => ({
      photons: state.photons + reward.giver,
      level: Math.floor((state.photons + reward.giver) / PHOTONS_PER_LEVEL) + 1,
    }));

    // 2. Simula a atualização para o autor do post (backend)
    console.log(`Simulando transação para o autor ${authorId}...`);
    
    try {
        await runTransaction(db, async (transaction) => {
            const userProgressRef = doc(db, 'userProgress', authorId);
            const userProgressSnap = await transaction.get(userProgressRef);

            if (!userProgressSnap.exists()) {
                console.log(`Documento de progresso para ${authorId} não encontrado.`);
                return;
            }

            const authorData = userProgressSnap.data();
            const newPhotons = (authorData.photons || 0) + reward.receiver;
            const newImpactScore = (authorData.impactScore || 0) + (interactionType === 'like' ? 1 : 0); // Só likes contam para o impacto

            const newBadges = authorData.badges || [];
            if (newImpactScore >= IMPACT_THRESHOLDS.RESONANCE && !newBadges.includes(BADGES.RESONANCE)) {
                newBadges.push(BADGES.RESONANCE);
            }

            transaction.update(userProgressRef, { 
                photons: newPhotons,
                impactScore: newImpactScore,
                badges: newBadges
             });
        });

        console.log(`Transação para ${authorId} concluída com sucesso.`);

    } catch (error) {
        console.error("Erro na transação de interação:", error);
    }
  },
}));