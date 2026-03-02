import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUserProgressStore } from "../stores/userProgressStore"; // Importa a store

export interface AuthUser extends User {
  role?: 'user' | 'moderator' | 'admin';
  status?: 'active' | 'blocked';
  blockedReason?: string;
  services?: {
    name: string;
    url: string;
    isActive: boolean;
  }[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Acessa as funções da store
  const { fetchUserProgress, clearUserProgress } = useUserProgressStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        let userData = {
          role: 'user' as const,
          status: 'active' as const,
        };

        if (!docSnap.exists()) {
          try {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date(),
              photons: 0,
              role: 'user',
              status: 'active'
            }, { merge: true });
          } catch (error) {
            console.error("Erro ao criar documento do usuário:", error);
          }
        } else {
          const data = docSnap.data();
          userData = {
            role: data.role || 'user',
            status: data.status || 'active',
            ...data
          };
        }
        
        fetchUserProgress(firebaseUser.uid);
        
        // Combina os dados do Firebase Auth com os dados do Firestore
        setUser({
          ...firebaseUser,
          ...userData
        } as AuthUser);

      } else {
        clearUserProgress();
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProgress, clearUserProgress]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
