
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Settings, 
  FileText, 
  Users, 
  Car, 
  Clock, 
  Phone,
  Building, 
  ChevronRight,
  Receipt,
  CreditCard as CreditCardIcon
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    clients: 0,
    vehicles: 0,
    invoices: 0,
    pendingInvoices: 0,
    resellers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch this data from your API
        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            clients: 24,
            vehicles: 42,
            invoices: 156,
            pendingInvoices: 8,
            resellers: user?.role === 'admin' ? 5 : 0
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const renderAdminShortcuts = () => {
    if (user?.role === 'admin') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Administração</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/settings/asaas')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Configurações do Asaas</h3>
                  <p className="text-sm text-muted-foreground">Gerenciar token de acesso e configurações de pagamento</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/whatsapp')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">Configurar integração com WhatsApp</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/resellers')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Building className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Revendas</h3>
                  <p className="text-sm text-muted-foreground">Gerenciar revendas cadastradas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    } else if (user?.role === 'reseller') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Administração da Revenda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/settings/asaas')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Configurações do Asaas</h3>
                  <p className="text-sm text-muted-foreground">Gerenciar token de acesso e configurações de pagamento da revenda</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/whatsapp')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">Configurar integração com WhatsApp</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderClientDashboard = () => {
    if (user?.role === 'client' || user?.role === 'end_client') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Minha Conta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/invoices')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Minhas Faturas</h3>
                  <p className="text-sm text-muted-foreground">Visualizar e pagar faturas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/my-vehicles')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Car className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Meus Veículos</h3>
                  <p className="text-sm text-muted-foreground">Visualizar veículos rastreados</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/plans')}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <CreditCardIcon className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Planos Disponíveis</h3>
                  <p className="text-sm text-muted-foreground">Conhecer planos e serviços</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderStatistics = () => {
    // Admin and Reseller see all stats
    if (user?.role === 'admin' || user?.role === 'reseller' || user?.role === 'manager') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.clients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes cadastrados no sistema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Veículos Monitorados
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.vehicles}</div>
              <p className="text-xs text-muted-foreground">
                Veículos ativos com rastreamento
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturas Emitidas
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.invoices}</div>
              <p className="text-xs text-muted-foreground">
                Total de faturas no sistema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturas Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">
                Faturas aguardando pagamento
              </p>
            </CardContent>
          </Card>
          {user?.role === 'admin' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revendas
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.resellers}</div>
                <p className="text-xs text-muted-foreground">
                  Revendas cadastradas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
    
    // Clients see only their own stats
    if (user?.role === 'client' || user?.role === 'end_client') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Meus Veículos
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : 2}</div>
              <p className="text-xs text-muted-foreground">
                Veículos ativos com rastreamento
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturas Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : 1}</div>
              <p className="text-xs text-muted-foreground">
                Faturas aguardando pagamento
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Plano Atual
              </CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : 'Premium'}</div>
              <p className="text-xs text-muted-foreground">
                Seu plano de rastreamento
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return null;
  };

  const renderActionButtons = () => {
    // Actions for admins and resellers
    if (user?.role === 'admin' || user?.role === 'reseller' || user?.role === 'manager') {
      return (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/clients')}
            >
              <Users className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Clientes</div>
                <div className="text-xs text-muted-foreground">Gerenciar clientes</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/trackers')}
            >
              <Car className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Rastreadores</div>
                <div className="text-xs text-muted-foreground">Gerenciar rastreadores</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/invoices')}
            >
              <FileText className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Faturas</div>
                <div className="text-xs text-muted-foreground">Gerenciar faturas</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/clients/new')}
            >
              <Users className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Novo Cliente</div>
                <div className="text-xs text-muted-foreground">Cadastrar cliente</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/invoices/new')}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Nova Fatura</div>
                <div className="text-xs text-muted-foreground">Criar fatura</div>
              </div>
            </Button>
            
            {(user?.role === 'admin' || user?.role === 'reseller') && (
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4"
                onClick={() => navigate('/settings/asaas')}
              >
                <Settings className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Configurações</div>
                  <div className="text-xs text-muted-foreground">Configurar sistema</div>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }
    
    // Actions for clients
    if (user?.role === 'client' || user?.role === 'end_client') {
      return (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/my-vehicles')}
            >
              <Car className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Meus Veículos</div>
                <div className="text-xs text-muted-foreground">Ver veículos</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/invoices')}
            >
              <FileText className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Minhas Faturas</div>
                <div className="text-xs text-muted-foreground">Ver e pagar faturas</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/plans')}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Planos</div>
                <div className="text-xs text-muted-foreground">Ver planos disponíveis</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo(a), {user?.username || 'Usuário'}! 
          {user?.role === 'admin' && ' (Administrador)'}
          {user?.role === 'reseller' && ' (Revenda)'}
          {user?.role === 'manager' && ' (Gerente)'}
          {user?.role === 'client' && ' (Cliente)'}
          {user?.role === 'end_client' && ' (Cliente Final)'}
        </p>
      </div>
      
      {renderAdminShortcuts()}
      {renderClientDashboard()}
      
      {renderStatistics()}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {renderActionButtons()}
        
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas atividades no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-[80%]" />
                <div className="h-4 bg-muted rounded animate-pulse w-[90%]" />
                <div className="h-4 bg-muted rounded animate-pulse w-[70%]" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="rounded-full w-2 h-2 bg-green-500 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium">Fatura paga</span>
                    <span className="text-muted-foreground"> - Cliente #1234</span>
                    <div className="text-xs text-muted-foreground">Hoje, 10:42</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full w-2 h-2 bg-blue-500 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium">Novo cliente cadastrado</span>
                    <div className="text-xs text-muted-foreground">Ontem, 15:30</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full w-2 h-2 bg-amber-500 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium">Fatura emitida</span>
                    <span className="text-muted-foreground"> - Cliente #5678</span>
                    <div className="text-xs text-muted-foreground">Ontem, 14:15</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full w-2 h-2 bg-red-500 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium">Fatura vencida</span>
                    <span className="text-muted-foreground"> - Cliente #9012</span>
                    <div className="text-xs text-muted-foreground">2 dias atrás</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
