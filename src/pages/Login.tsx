
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/Auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            Test accounts: <br />
            Admin: username <span className="font-medium">admin</span>, password <span className="font-medium">admin</span> <br />
            Client: username <span className="font-medium">client</span>, password <span className="font-medium">client</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
