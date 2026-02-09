import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Referência para o documento do usuário no Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        // Se o documento não existe, é o primeiro login do usuário.
        if (!docSnap.exists()) {
          // Cria o documento com os dados do provedor (Google)
          try {
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              createdAt: new Date() // Adiciona um timestamp de criação
            }, { merge: true }); // Use merge para evitar sobrescrever dados acidentalmente
          } catch (error) {
            console.error("Erro ao salvar dados do usuário no Firestore:", error);
          }
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
