import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import GratitudeJournal from './pages/GratitudeJournal';
import PublicFeed from './pages/PublicFeed';
import PostPage from './pages/PostPage';
import { Login } from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="/gratitude-journal" element={<PrivateRoute><GratitudeJournal /></PrivateRoute>} />
            <Route path="/public-feed" element={<PublicFeed />} />
            <Route path="/post/:id" element={<PostPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
