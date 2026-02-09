import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { AtomoQuanticoLogo } from "../components/AtomoQuanticoLogo";

export function Login() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Usuário logado:", result.user.displayName);
        navigate("/gratitude-journal");
      })
      .catch((error) => {
        console.error("Erro no login com Google:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="bg-background p-10 rounded-2xl shadow-lg text-center max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <AtomoQuanticoLogo />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Bem-vindo de volta!</h1>
        <p className="text-text-secondary mb-8">Faça login para continuar sua jornada de gratidão.</p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-3 text-text-primary font-medium hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-6 w-6 mr-4" />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
