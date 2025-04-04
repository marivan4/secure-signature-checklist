
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LogOut, 
  User, 
  Menu, 
  X, 
  Home, 
  ClipboardList, 
  FileText,
  MessageSquare,
  Settings,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Define menu items with their allowed roles
  const getMenuItems = () => {
    const items = [
      { label: 'Início', path: '/dashboard', icon: <Home className="mr-2 h-4 w-4" />, roles: ['admin', 'manager', 'client', 'reseller', 'end_client'] },
      { label: 'Contratos', path: '/checklist/new', icon: <ClipboardList className="mr-2 h-4 w-4" />, roles: ['admin', 'reseller'] },
      { label: 'Faturas', path: '/invoices', icon: <FileText className="mr-2 h-4 w-4" />, roles: ['admin', 'manager', 'client', 'reseller', 'end_client'] },
      { label: 'WhatsApp', path: '/whatsapp', icon: <MessageSquare className="mr-2 h-4 w-4" />, roles: ['admin', 'reseller'] },
      { label: 'Asaas', path: '/settings/asaas', icon: <CreditCard className="mr-2 h-4 w-4" />, roles: ['admin', 'reseller'] },
      { label: 'Configurações', path: '/settings', icon: <Settings className="mr-2 h-4 w-4" />, roles: ['admin'] },
    ];

    // Filtra itens de menu com base na função do usuário
    return items.filter(item => 
      !item.roles || (user && item.roles.includes(user.role))
    );
  };

  const filteredMenuItems = getMenuItems();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/assets/logo.svg" alt="Logo" className="h-8 w-auto" />
          <span className="font-medium hidden md:inline-block">Sistema de Rastreamento</span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <nav className="mx-6 hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuItem className="text-muted-foreground">
                    {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground">
                    {user.role === 'admin' && 'Administrador'}
                    {user.role === 'manager' && 'Gerente'}
                    {user.role === 'client' && 'Cliente'}
                    {user.role === 'reseller' && 'Revenda'}
                    {user.role === 'end_client' && 'Cliente Final'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
                onClick={toggleMenu}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && menuOpen && user && (
        <div className="md:hidden border-t">
          <div className="container py-3">
            <nav className="flex flex-col space-y-3">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center px-3 py-2 rounded-md",
                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={closeMenu}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center px-3 py-2 rounded-md cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
