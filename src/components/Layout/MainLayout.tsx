
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
  LogOut,
  CreditCard,
  FileText,
  Calendar,
  Store,
  Car
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
  roles?: string[];
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active, roles, onClick }) => {
  const { user } = useAuth();
  
  // Check if the current user role is allowed to see this item
  if (roles && user && !roles.includes(user.role)) {
    return null;
  }
  
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-white transition-colors hover:bg-white/10",
        active && "bg-white/10 font-medium"
      )}
      onClick={onClick}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isSignaturePage = location.pathname.includes('/signature/');
  const currentPath = location.pathname;

  // Don't show sidebar on login or index page
  const shouldShowSidebar = !location.pathname.includes('/login') && location.pathname !== '/';

  const handleLogout = useCallback(() => {
    if (logout) {
      logout();
      navigate('/login');
    }
  }, [logout, navigate]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Don't show sidebar/header/footer on signature page for a cleaner experience
  if (isSignaturePage) {
    return <div className="min-h-screen animate-fade-in">{children}</div>;
  }

  // Define role-based navigation items with allowed roles
  const navigationItems: SidebarItemProps[] = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/dashboard", 
      active: currentPath === '/dashboard',
      roles: ['admin', 'manager', 'client', 'reseller', 'end_client']
    },
    { 
      icon: Users, 
      label: "Clientes", 
      href: "/clients", 
      active: currentPath.startsWith('/clients'),
      roles: ['admin', 'manager', 'reseller'] 
    },
    { 
      icon: MapPin, 
      label: "Rastreadores", 
      href: "/trackers", 
      active: currentPath.startsWith('/trackers'),
      roles: ['admin', 'manager', 'reseller', 'client'] 
    },
    { 
      icon: DollarSign, 
      label: "Financeiro", 
      href: "/invoices", 
      active: currentPath === '/invoices',
      roles: ['admin', 'manager', 'reseller', 'client', 'end_client'] 
    },
    { 
      icon: FileText, 
      label: "Nova Fatura", 
      href: "/invoices/new", 
      active: currentPath === '/invoices/new',
      roles: ['admin', 'manager', 'reseller'] 
    },
    { 
      icon: CreditCard, 
      label: "Planos", 
      href: "/plans", 
      active: currentPath.startsWith('/plans'),
      roles: ['admin', 'manager', 'reseller', 'client'] 
    },
    { 
      icon: Calendar, 
      label: "Agendamentos", 
      href: "/scheduling/settings", 
      active: currentPath.startsWith('/scheduling'),
      roles: ['admin', 'manager', 'reseller'] 
    },
    { 
      icon: Home, 
      label: "Marketplace", 
      href: "/marketplace", 
      active: currentPath.startsWith('/marketplace'),
      roles: ['admin', 'manager', 'reseller', 'client'] 
    },
    { 
      icon: Shield, 
      label: "Seguros", 
      href: "/insurance", 
      active: currentPath.startsWith('/insurance'),
      roles: ['admin', 'manager', 'reseller', 'client'] 
    },
    { 
      icon: Store, 
      label: "Revendas", 
      href: "/resellers", 
      active: currentPath.startsWith('/resellers'),
      roles: ['admin'] 
    },
    { 
      icon: Settings, 
      label: "Configurações", 
      href: "/settings", 
      active: currentPath === '/settings' || currentPath.startsWith('/integrations'),
      roles: ['admin', 'reseller'] 
    },
    { 
      icon: Car, 
      label: "Meus Veículos", 
      href: "/my-vehicles", 
      active: currentPath.startsWith('/my-vehicles'),
      roles: ['client', 'end_client'] 
    },
  ];

  // For reseller, add special link to reseller dashboard
  if (user?.role === 'reseller') {
    navigationItems.unshift({
      icon: Store,
      label: "Portal da Revenda",
      href: "/reseller-dashboard",
      active: currentPath.startsWith('/reseller-dashboard'),
      roles: ['reseller']
    });
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
              {navigationItems.map((item, index) => (
                <SidebarItem 
                  key={index}
                  icon={item.icon} 
                  label={item.label} 
                  href={item.href} 
                  active={item.active}
                  roles={item.roles}
                />
              ))}
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
