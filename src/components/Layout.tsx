import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      {!isLoginPage && <Header />}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-2 sm:px-6 lg:px-12 py-4 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
