import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/firebase";
import { AtomoQuanticoLogo } from "../components/AtomoQuanticoLogo";

export function Login() {
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    // Apenas inicia o processo de login.
    // O AuthContext e o App.tsx cuidarão do resto.
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Erro no login com Google:", error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="bg-background p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AtomoQuanticoLogo />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-4">Acesse seu Santuário Quântico</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          Conecte-se ao seu universo de gratidão. Ao entrar, você poderá registrar suas reflexões, interagir com a comunidade e ver sua jornada de positividade crescer.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-3 text-gray-800 font-medium hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-6 w-6 mr-4" />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
