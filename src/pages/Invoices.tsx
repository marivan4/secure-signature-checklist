
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Download,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/lib/types';
import { getInvoices, deleteInvoice } from '@/services/invoiceApi';
import { formatCurrency } from '@/lib/utils';

const InvoicePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const { data: invoices = [], isLoading, refetch } = useQuery({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      // Se for cliente, filtra por userId
      if (user?.role === 'client') {
        return getInvoices(user.id);
      }
      // Admin e gerente veem todas as faturas
      return getInvoices();
    }
  });

  const handleDeleteInvoice = async (id: number) => {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta fatura?');
    if (!confirmDelete) return;

    try {
      const success = await deleteInvoice(id);
      if (success) {
        toast.success('Fatura excluída com sucesso');
        refetch();
      } else {
        toast.error('Erro ao excluir fatura');
      }
    } catch (error) {
      toast.error('Erro ao excluir fatura');
    }
  };

  // Filtra faturas com base na aba ativa
  const getFilteredInvoices = () => {
    let filtered = [...invoices];

    // Filtra por status
    if (activeTab !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === activeTab);
    }

    // Filtra por termo de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  // Calcula resumos para os cards
  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;

  // Calcula valor total das faturas pendentes
  const pendingTotal = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((acc, invoice) => acc + invoice.amount, 0);

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faturas</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'client' 
              ? 'Visualize suas faturas' 
              : 'Gerencie todas as faturas do sistema'}
          </p>
        </div>
        
        {user?.role !== 'client' && (
          <Button onClick={() => navigate('/invoices/new')}>
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Faturas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalInvoices} faturas no sistema
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total pendente: {formatCurrency(pendingTotal)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pagas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((paidInvoices / totalInvoices) * 100) || 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar faturas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="paid">Pagas</TabsTrigger>
        </TabsList>
        
        <div className="border rounded-md">
          <Table>
            <TableCaption>
              {isLoading ? 'Carregando faturas...' : 
                filteredInvoices.length > 0 ? 
                `Total de ${filteredInvoices.length} faturas` : 
                'Nenhuma fatura encontrada'}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nº da Fatura</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">Carregando...</TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">Nenhuma fatura encontrada</TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={
                          invoice.status === 'paid' ? 'success' : 
                          invoice.status === 'pending' ? 'warning' : 
                          'destructive'
                        }
                      >
                        {invoice.status === 'paid' ? 'Paga' : 
                         invoice.status === 'pending' ? 'Pendente' : 
                         'Cancelada'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        
                        {user?.role !== 'client' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/invoices/${invoice.id}/send`)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/invoices/${invoice.id}/export`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Tabs>
    </div>
  );
};

export default InvoicePage;
