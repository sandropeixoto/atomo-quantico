import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import GratitudeJournal from './pages/GratitudeJournal';
import PublicFeed from './pages/PublicFeed';
import PostPage from './pages/PostPage';
import Profile from './pages/Profile';
import { Journey } from './pages/Journey';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { SplashScreen } from './components/SplashScreen';

// Componente para gerenciar a lógica de roteamento
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Esconde o splash após 3 segundos ou quando o carregamento inicial termina
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Mostra um spinner enquanto o estado de autenticação está sendo verificado
  if (loading && showSplash) {
    return <SplashScreen isVisible={true} />;
  }

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/gratitude-journal" element={<PrivateRoute><GratitudeJournal /></PrivateRoute>} />
          <Route path="/public-feed" element={<PublicFeed />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/journey" element={<PrivateRoute><Journey /></PrivateRoute>} />
          
          {/* Se o usuário estiver logado, redireciona /login para o diário */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/gratitude-journal" replace /> : <Login />}
          />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
