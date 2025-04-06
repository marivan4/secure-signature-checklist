
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Phone, 
  MessageSquare, 
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const ResellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Set active tab based on current location
  useEffect(() => {
    if (location.pathname === '/reseller-dashboard') {
      setActiveTab('dashboard');
    } else if (location.pathname.includes('/reseller-dashboard/clients')) {
      setActiveTab('clients');
    } else if (location.pathname.includes('/reseller-dashboard/finance')) {
      setActiveTab('finance');
    } else if (location.pathname.includes('/reseller-dashboard/integrations')) {
      setActiveTab('integrations');
    }
  }, [location]);

  if (!user || user.role !== 'reseller') {
    return (
      <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Esta área é exclusiva para revendas cadastradas no sistema.</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => navigate('/')}
            >
              Voltar para a página inicial
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal da Revenda</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo(a) ao seu painel de controle, {user.name || user.username}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/reseller-dashboard/settings"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link 
            to="/reseller-dashboard/notifications"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Bell className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        
        // Navigate based on tab selection
        switch(value) {
          case 'dashboard':
            navigate('/reseller-dashboard');
            break;
          case 'clients':
            navigate('/reseller-dashboard/clients');
            break;
          case 'finance':
            navigate('/reseller-dashboard/finance');
            break;
          case 'integrations':
            navigate('/reseller-dashboard/integrations');
            break;
        }
      }} className="w-full mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="finance">
            <DollarSign className="mr-2 h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <CreditCard className="mr-2 h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>
        
        <Outlet />
      </Tabs>
    </div>
  );
};

export default ResellerDashboard;
