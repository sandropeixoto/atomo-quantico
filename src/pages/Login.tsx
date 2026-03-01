import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from "firebase/auth";
import { useState } from "react";
import { auth } from "../services/firebase";
import { AtomoQuanticoLogo } from "../components/AtomoQuanticoLogo";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export function Login() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // --- LOGIN NATIVO (ANDROID/IOS) ---
        // Forçamos o uso do plugin nativo que é o único que funciona de forma confiável no Capacitor
        const result = await FirebaseAuthentication.signInWithGoogle();
        
        if (result.user && result.credential) {
          const credential = GoogleAuthProvider.credential(result.credential.idToken);
          await signInWithCredential(auth, credential);
          console.log("Login nativo realizado com sucesso");
        }
      } else {
        // --- LOGIN WEB (BROWSER) ---
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      console.error("Erro no login com Google:", error);
      // Se o erro for de cancelamento pelo usuário, não exibimos alerta
      if (error.message !== 'Sign in canceled by user') {
        alert("Falha ao entrar com Google. Verifique sua conexão.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="bg-background p-8 sm:p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/5 relative overflow-hidden">
        {/* Efeito visual de fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <AtomoQuanticoLogo />
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mb-4 tracking-tight">
            Bem-vindo ao Átomo
          </h1>
          <p className="text-text-secondary mb-10 leading-relaxed text-sm px-4">
            Sua jornada de gratidão começa aqui. Conecte-se para evoluir sua consciência e compartilhar luz.
          </p>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isAuthenticating}
            className={`w-full flex items-center justify-center bg-white rounded-2xl shadow-xl px-6 py-4 text-gray-900 font-bold transition-all active:scale-95 ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            {isAuthenticating ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-3 border-secondary border-t-transparent rounded-full animate-spin mr-3"></div>
                Conectando...
              </div>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-6 w-6 mr-4" />
                Entrar com Google
              </>
            )}
          </button>
          
          <div className="mt-10 pt-6 border-t border-white/5">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] opacity-40 font-bold">
              Versão 2.0 • Sistema Nativo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
