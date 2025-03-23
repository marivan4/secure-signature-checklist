
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">SC</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">SecureCheck</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-1 text-sm font-medium">
                <User size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground mr-2">|</span>
                <span>{user?.username}</span>
                <span className="chip ml-2 capitalize">{user?.role}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
