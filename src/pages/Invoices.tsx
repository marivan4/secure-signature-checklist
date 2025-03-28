
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Edit,
  Filter,
  ExternalLink,
  QrCode,
  CreditCard,
  AlertCircle,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/lib/types';
import { getInvoices, deleteInvoice } from '@/services/invoiceApi';
import { formatCurrency } from '@/lib/utils';
import { getAllPayments, getPixQrCode } from '@/services/asaasApi';

const InvoicePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [pixDialogOpen, setPixDialogOpen] = useState(false);
  
  // Busca faturas do sistema interno
  const { data: invoices = [], isLoading: isLoadingInvoices, refetch: refetchInvoices } = useQuery({
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

  // Busca pagamentos diretamente do Asaas
  const { data: asaasPayments = [], isLoading: isLoadingAsaas, refetch: refetchAsaas } = useQuery({
    queryKey: ['asaas-payments'],
    queryFn: () => getAllPayments(),
    enabled: user?.role === 'admin' || user?.role === 'manager',
  });

  // Busca QR Code PIX quando necessário
  const { data: pixQrCode, isLoading: isLoadingPix } = useQuery({
    queryKey: ['pix-qrcode', selectedPaymentId],
    queryFn: () => getPixQrCode(selectedPaymentId || ''),
    enabled: !!selectedPaymentId && pixDialogOpen,
  });

  const handleDeleteInvoice = async (id: number) => {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta fatura?');
    if (!confirmDelete) return;

    try {
      const success = await deleteInvoice(id);
      if (success) {
        toast.success('Fatura excluída com sucesso');
        refetchInvoices();
      } else {
        toast.error('Erro ao excluir fatura');
      }
    } catch (error) {
      toast.error('Erro ao excluir fatura');
    }
  };

  // Filtra faturas do sistema interno com base na aba ativa
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

  // Filtra pagamentos do Asaas com base na aba ativa
  const getFilteredAsaasPayments = () => {
    let filtered = [...asaasPayments];

    // Filtra por status
    if (activeTab === 'pending') {
      filtered = filtered.filter(payment => payment.status === 'PENDING');
    } else if (activeTab === 'paid') {
      filtered = filtered.filter(payment => payment.status === 'RECEIVED' || payment.status === 'CONFIRMED');
    } else if (activeTab === 'overdue') {
      filtered = filtered.filter(payment => payment.status === 'OVERDUE');
    }

    // Filtra por termo de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment => 
        (payment.invoiceNumber?.toLowerCase().includes(query) || false) ||
        (payment.description?.toLowerCase().includes(query) || false)
      );
    }

    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();
  const filteredAsaasPayments = getFilteredAsaasPayments();

  // Calcula resumos para os cards
  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;

  // Calcula resumos para os pagamentos do Asaas
  const totalAsaasPayments = asaasPayments.length;
  const pendingAsaasPayments = asaasPayments.filter(payment => payment.status === 'PENDING').length;
  const paidAsaasPayments = asaasPayments.filter(payment => payment.status === 'RECEIVED' || payment.status === 'CONFIRMED').length;
  const overdueAsaasPayments = asaasPayments.filter(payment => payment.status === 'OVERDUE').length;

  // Calcula valor total das faturas pendentes
  const pendingTotal = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((acc, invoice) => acc + invoice.amount, 0);
    
  // Calcula valor total dos pagamentos do Asaas
  const pendingAsaasTotal = asaasPayments
    .filter(payment => payment.status === 'PENDING')
    .reduce((acc, payment) => acc + payment.value, 0);
    
  const overdueAsaasTotal = asaasPayments
    .filter(payment => payment.status === 'OVERDUE')
    .reduce((acc, payment) => acc + payment.value, 0);

  const handleShowPixQrCode = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setPixDialogOpen(true);
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(message);
      },
      (err) => {
        console.error('Erro ao copiar: ', err);
        toast.error('Erro ao copiar para a área de transferência');
      }
    );
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const refetchAll = () => {
    refetchInvoices();
    if (user?.role === 'admin' || user?.role === 'manager') {
      refetchAsaas();
    }
  };

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
          <div className="flex gap-2">
            <Button onClick={() => navigate('/plans')}>
              <CreditCard className="mr-2 h-4 w-4" /> Novo Cliente e Plano
            </Button>
            <Button onClick={() => navigate('/invoices/new')}>
              <Plus className="mr-2 h-4 w-4" /> Nova Fatura
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Faturas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role === 'admin' ? totalAsaasPayments || totalInvoices : totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.role === 'admin' ? totalAsaasPayments || totalInvoices : totalInvoices} faturas no sistema
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role === 'admin' ? pendingAsaasPayments || pendingInvoices : pendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total pendente: {formatCurrency(user?.role === 'admin' ? pendingAsaasTotal || pendingTotal : pendingTotal)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'admin' ? 'Faturas Vencidas' : 'Faturas Pagas'}
            </CardTitle>
            {user?.role === 'admin' ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === 'admin' ? overdueAsaasPayments : paidInvoices}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.role === 'admin' 
                ? `Total vencido: ${formatCurrency(overdueAsaasTotal)}`
                : `${Math.round((paidInvoices / totalInvoices) * 100) || 0}% do total`
              }
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
        
        <Button variant="outline" size="icon" onClick={refetchAll}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="paid">Pagas</TabsTrigger>
          <TabsTrigger value="overdue">Vencidas</TabsTrigger>
        </TabsList>
        
        {user?.role === 'admin' && asaasPayments.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableCaption>
                {isLoadingAsaas ? 'Carregando faturas...' : 
                  filteredAsaasPayments.length > 0 ? 
                  `Total de ${filteredAsaasPayments.length} faturas no Asaas` : 
                  'Nenhuma fatura encontrada no Asaas'}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº da Fatura</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingAsaas ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">Carregando...</TableCell>
                  </TableRow>
                ) : filteredAsaasPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">Nenhuma fatura encontrada</TableCell>
                  </TableRow>
                ) : (
                  filteredAsaasPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                      <TableCell>{payment.description || 'Sem descrição'}</TableCell>
                      <TableCell>{formatCurrency(payment.value)}</TableCell>
                      <TableCell>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        {payment.billingType === 'BOLETO' && 'Boleto'}
                        {payment.billingType === 'PIX' && 'PIX'}
                        {payment.billingType === 'CREDIT_CARD' && 'Cartão'}
                        {payment.billingType === 'TRANSFER' && 'Transferência'}
                        {payment.billingType === 'DEPOSIT' && 'Depósito'}
                        {payment.billingType === 'UNDEFINED' && 'Indefinido'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={
                            payment.status === 'RECEIVED' || payment.status === 'CONFIRMED' ? 'success' : 
                            payment.status === 'PENDING' ? 'warning' : 
                            'destructive'
                          }
                        >
                          {payment.status === 'RECEIVED' || payment.status === 'CONFIRMED' ? 'Pago' : 
                           payment.status === 'PENDING' ? 'Pendente' : 
                           payment.status === 'OVERDUE' ? 'Vencido' :
                           payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {payment.invoiceUrl && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openInNewTab(payment.invoiceUrl || '')}
                              title="Ver Fatura"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {payment.billingType === 'PIX' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleShowPixQrCode(payment.id || '')}
                              title="Ver QR Code PIX"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {payment.billingType === 'BOLETO' && payment.bankSlipUrl && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openInNewTab(payment.bankSlipUrl || '')}
                              title="Ver Boleto"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableCaption>
                {isLoadingInvoices ? 'Carregando faturas...' : 
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
                {isLoadingInvoices ? (
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
        )}
      </Tabs>

      {/* Modal para exibir o QR Code PIX */}
      <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pagamento PIX</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code abaixo com o aplicativo do seu banco ou copie o código PIX
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center p-4">
            {isLoadingPix ? (
              <div className="flex justify-center items-center h-40 w-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pixQrCode ? (
              <>
                <img 
                  src={pixQrCode.encodedImage} 
                  alt="QR Code PIX"
                  className="mb-4 h-40 w-40 object-contain"
                />
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => copyToClipboard(pixQrCode.payload, 'Código PIX copiado!')}
                >
                  Copiar Código PIX
                </Button>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                Não foi possível gerar o QR Code PIX
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicePage;
