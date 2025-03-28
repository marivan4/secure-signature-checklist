
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  DollarSign, 
  Home, 
  Shield, 
  Settings,
  ChevronRight,
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-white transition-colors hover:bg-white/10",
        active && "bg-white/10 font-medium"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  const isSignaturePage = location.pathname.includes('/signature/');
  const currentPath = location.pathname;

  // Make sure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  // Don't show sidebar on login or index page
  const shouldShowSidebar = !location.pathname.includes('/login') && location.pathname !== '/';

  const handleLogout = useCallback(() => {
    if (logout) {
      logout();
      navigate('/login');
    }
  }, [logout, navigate]);

  // Don't show sidebar/header/footer on signature page for a cleaner experience
  if (isSignaturePage) {
    return <div className="min-h-screen animate-fade-in">{children}</div>;
  }

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {shouldShowSidebar && user && (
          <aside className="hidden md:flex flex-col w-56 bg-[#5D3FD3] text-white p-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-6 py-2">
              <div className="font-bold text-lg">Track'n'Me</div>
            </div>
            
            <nav className="space-y-1 flex-1">
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                href="/dashboard" 
                active={currentPath === '/dashboard'} 
              />
              <SidebarItem 
                icon={Users} 
                label="Clientes" 
                href="/clients" 
                active={currentPath.startsWith('/clients')} 
              />
              <SidebarItem 
                icon={MapPin} 
                label="Rastreadores" 
                href="/trackers" 
                active={currentPath.startsWith('/trackers')} 
              />
              <SidebarItem 
                icon={DollarSign} 
                label="Financeiro" 
                href="/invoices" 
                active={currentPath.startsWith('/invoices')} 
              />
              <SidebarItem 
                icon={Home} 
                label="Marketplace" 
                href="/marketplace" 
                active={currentPath.startsWith('/marketplace')} 
              />
              <SidebarItem 
                icon={Shield} 
                label="Seguros" 
                href="/insurance" 
                active={currentPath.startsWith('/insurance')} 
              />
              
              {user && user.role === 'admin' && (
                <SidebarItem 
                  icon={Settings} 
                  label="Administração" 
                  href="/whatsapp" 
                  active={currentPath.startsWith('/whatsapp')} 
                />
              )}
            </nav>
            
            <div className="pt-4 mt-4 border-t border-white/20">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-white/10 px-3" 
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </Button>
            </div>
          </aside>
        )}
        
        <main className={cn(
          "flex-1 animate-fade-in",
          shouldShowSidebar ? "md:ml-0" : ""
        )}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
