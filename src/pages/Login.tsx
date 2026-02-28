import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { AtomoQuanticoLogo } from "../components/AtomoQuanticoLogo";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

export function Login() {
  const provider = new GoogleAuthProvider();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Login realizado com sucesso via redirecionamento");
        }
      } catch (error) {
        console.error("Erro ao processar redirecionamento:", error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    handleRedirect();

    if (Capacitor.isNativePlatform()) {
      const setupDeepLinkListener = async () => {
        await App.addListener('appUrlOpen', async (event) => {
          console.log('App reaberto via URL:', event.url);
          // Ao retornar do navegador, fechamos o browser nativo manualmente para garantir
          await Browser.close();
        });
      };
      
      setupDeepLinkListener();
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // O signInWithRedirect do Firebase JS SDK abrirá o navegador
        // automaticamente se o plugin @capacitor/browser estiver instalado.
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setIsAuthenticating(false);
      alert("Falha ao iniciar login. Verifique sua conexão.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="bg-background p-8 sm:p-10 rounded-2xl shadow-lg text-center max-w-md w-full border border-white/5">
        <div className="flex justify-center mb-6">
          <AtomoQuanticoLogo />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-4 text-balance">Acesse seu Santuário Quântico</h1>
        <p className="text-text-secondary mb-8 leading-relaxed text-sm">
          Conecte-se ao seu universo de gratidão. Ao entrar, você poderá registrar suas reflexões e ver sua jornada de positividade crescer.
        </p>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={isAuthenticating}
          className={`w-full flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-4 text-gray-800 font-bold transition-all active:scale-95 ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
        >
          {isAuthenticating ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin mr-3"></div>
              Iniciando...
            </div>
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-6 w-6 mr-4" />
              Entrar com Google
            </>
          )}
        </button>
        
        <p className="mt-8 text-[10px] text-text-secondary uppercase tracking-widest opacity-50 font-medium">
          Versão 1.5 • {Capacitor.isNativePlatform() ? 'Android Native' : 'Web App'}
        </p>
      </div>
    </div>
  );
}
