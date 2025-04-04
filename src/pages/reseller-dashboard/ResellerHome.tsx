
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  BarChart3, 
  Phone, 
  Clock, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

// Mock data for dashboard
const dashboardData = {
  clientsCount: 32,
  activeClients: 28,
  pendingClients: 4,
  monthlyRevenue: 5500,
  overdueInvoices: 3,
  pendingInvoices: 7,
  apiStatus: {
    asaas: true,
    whatsapp: true
  },
  recentActivities: [
    {
      id: 1,
      type: 'client_added',
      message: 'Novo cliente adicionado: João Silva',
      timestamp: '2023-10-25T14:30:00Z'
    },
    {
      id: 2,
      type: 'payment_received',
      message: 'Pagamento recebido: R$ 150,00 - Maria Santos',
      timestamp: '2023-10-24T10:15:00Z'
    },
    {
      id: 3,
      type: 'invoice_created',
      message: 'Nova fatura criada: R$ 99,90 - Pedro Oliveira',
      timestamp: '2023-10-23T16:45:00Z'
    },
    {
      id: 4,
      type: 'api_connected',
      message: 'Integração com WhatsApp configurada com sucesso',
      timestamp: '2023-10-22T09:20:00Z'
    },
    {
      id: 5,
      type: 'invoice_overdue',
      message: 'Fatura vencida: R$ 99,90 - Ana Costa',
      timestamp: '2023-10-21T08:10:00Z'
    }
  ]
};

const ResellerHome: React.FC = () => {
  const { user } = useAuth();
  
  // Format date to Brazilian format (DD/MM/YYYY HH:MM)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };
  
  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client_added':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'payment_received':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'invoice_created':
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      case 'api_connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invoice_overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <TabsContent value="dashboard" className="mt-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.clientsCount}
            </div>
            <p className="text-xs text-muted-foreground flex justify-between mt-1">
              <span>{dashboardData.activeClients} ativos</span>
              <span>{dashboardData.pendingClients} pendentes</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dashboardData.monthlyRevenue.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-muted-foreground flex justify-between mt-1">
              <span>{dashboardData.pendingInvoices} faturas pendentes</span>
              <span>{dashboardData.overdueInvoices} vencidas</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status Asaas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {dashboardData.apiStatus.asaas ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {dashboardData.apiStatus.asaas ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <Link 
              to="/reseller-dashboard/integrations"
              className="text-xs text-blue-500 hover:underline mt-2 inline-block"
            >
              Configurar integração
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status WhatsApp
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {dashboardData.apiStatus.whatsapp ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {dashboardData.apiStatus.whatsapp ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <Link 
              to="/reseller-dashboard/integrations"
              className="text-xs text-blue-500 hover:underline mt-2 inline-block"
            >
              Configurar integração
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atividades da sua revenda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>
              Atalhos para as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <Button className="w-full justify-between" asChild>
              <Link to="/reseller-dashboard/clients/new">
                Adicionar Novo Cliente
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button className="w-full justify-between" asChild>
              <Link to="/reseller-dashboard/finance">
                Ver Relatório Financeiro
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button className="w-full justify-between" asChild>
              <Link to="/reseller-dashboard/integrations">
                Configurar Integrações
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button className="w-full justify-between" variant="outline" asChild>
              <Link to="/reseller-dashboard/clients">
                Gerenciar Clientes
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default ResellerHome;
