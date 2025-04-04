
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Users, 
  Edit,
  BarChart3,
  CreditCard,
  Settings,
  History,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ResellerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Mock data for a reseller (in a real app, fetch this from API)
  const reseller = {
    id: Number(id),
    name: 'Rastreadores São Paulo',
    logo: 'https://via.placeholder.com/200',
    address: 'Av. Paulista, 1578',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-200',
    email: 'contato@rastreadores-sp.com.br',
    phone: '(11) 3456-7890',
    contactName: 'Carlos Silva',
    contactPhone: '(11) 98765-4321',
    since: '2019-05-10',
    status: 'active',
    clientsCount: 125,
    monthlyRevenue: 15000,
    lastInvoiceDate: '2023-06-15',
    lastInvoiceAmount: 1250.00,
    paymentStatus: 'paid',
    asaasConfigured: true,
    description: 'Uma das principais revendas de rastreadores no estado de São Paulo, com foco em atendimento personalizado e soluções para frotas empresariais.'
  };
  
  // Format date to Brazilian format (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inativa</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/resellers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{reseller.name}</h1>
              {getStatusBadge(reseller.status)}
            </div>
            <p className="text-muted-foreground mt-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {reseller.city}, {reseller.state}
            </p>
          </div>
        </div>
        
        {user?.role === 'admin' && (
          <Button asChild>
            <Link to={`/resellers/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Revenda
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{reseller.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{reseller.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{reseller.address}, {reseller.city} - {reseller.state}, {reseller.zipCode}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Contato: {reseller.contactName} - {reseller.contactPhone}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informações Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Receita mensal: R$ {reseller.monthlyRevenue.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Última fatura: R$ {reseller.lastInvoiceAmount.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Data: {formatDate(reseller.lastInvoiceDate)}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="ml-6">Status: {getPaymentStatusBadge(reseller.paymentStatus)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Desde: {formatDate(reseller.since)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Total de clientes: {reseller.clientsCount}</span>
            </div>
            <div className="flex items-center text-sm">
              <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Integração Asaas: {reseller.asaasConfigured ? 'Configurada' : 'Não configurada'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Clientes da Revenda</CardTitle>
              <CardDescription>Lista de clientes cadastrados por esta revenda</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nesta seção, serão listados todos os clientes que foram cadastrados por esta revenda.
                Em um sistema real, esta tabela seria preenchida com dados do banco de dados.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Faturas da Revenda</CardTitle>
              <CardDescription>Histórico de faturas e pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aqui seriam listadas todas as faturas relacionadas a esta revenda,
                incluindo faturas da própria revenda e as geradas por ela para seus clientes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Vendas da Revenda</CardTitle>
              <CardDescription>Histórico de vendas e comissões</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nesta seção, seriam mostradas todas as vendas realizadas por esta revenda,
                incluindo produtos, serviços e valores de comissão.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Análise de desempenho da revenda</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aqui seriam exibidos gráficos e relatórios detalhados sobre o desempenho
                desta revenda ao longo do tempo, incluindo crescimento de clientes,
                receita mensal e outros indicadores relevantes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerDetail;
