
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { toast } from 'sonner';
import api from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Em desenvolvimento, usa mock. Em produção, usa a API PHP
      let user;
      
      // Se estamos em produção
      if (import.meta.env.PROD) {
        const response = await api.post('/login.php', {
          username,
          password
        });
        user = response.data;
      } else {
        // Mock login para desenvolvimento com os novos papéis
        if (username === 'admin' && password === 'admin') {
          user = {
            id: 1,
            username: 'admin',
            role: 'admin',
            createdAt: new Date().toISOString()
          };
        } else if (username === 'client' && password === 'client') {
          user = {
            id: 2,
            username: 'client',
            role: 'client',
            createdAt: new Date().toISOString()
          };
        } else if (username === 'reseller' && password === 'reseller') {
          user = {
            id: 3,
            username: 'reseller',
            name: 'Rastreadores São Paulo',
            email: 'contato@rastreadores-sp.com.br',
            phone: '(11) 3456-7890',
            address: 'Av. Paulista, 1578',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-200',
            role: 'reseller',
            parentId: 1, // Created by admin
            createdAt: new Date().toISOString()
          };
        } else if (username === 'endclient' && password === 'endclient') {
          user = {
            id: 4,
            username: 'endclient',
            role: 'end_client',
            parentId: 3, // Belongs to reseller with ID 3
            createdAt: new Date().toISOString()
          };
        } else if (username === 'manager' && password === 'manager') {
          user = {
            id: 5,
            username: 'manager',
            role: 'manager',
            createdAt: new Date().toISOString()
          };
        }
      }
      
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful');
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
