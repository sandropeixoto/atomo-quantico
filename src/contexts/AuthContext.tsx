import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUserProgressStore } from "../stores/userProgressStore"; // Importa a store

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Acessa as funções da store
  const { fetchUserProgress, clearUserProgress } = useUserProgressStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          try {
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              createdAt: new Date(),
              photons: 0, // Garante que o campo de fótons exista no primeiro login
            }, { merge: true });
          } catch (error) {
            console.error("Erro ao criar documento do usuário:", error);
          }
        }
        
        // **[NOVO]** Busca o progresso do usuário no Firestore e popula a store
        fetchUserProgress(user.uid);

      } else {
        // **[NOVO]** Se não há usuário, limpa os dados da store
        clearUserProgress();
      }
      
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  // Adiciona as funções da store como dependências do useEffect
  }, [fetchUserProgress, clearUserProgress]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
