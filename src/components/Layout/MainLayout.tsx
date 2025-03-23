
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isSignaturePage = location.pathname.includes('/signature/');

  // Don't show header/footer on signature page for a cleaner experience
  if (isSignaturePage) {
    return <div className="min-h-screen animate-fade-in">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
