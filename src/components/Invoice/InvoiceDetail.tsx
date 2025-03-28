
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Loader2, 
  ArrowLeft, 
  Send, 
  Download, 
  Edit, 
  Trash2,
  FileText,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  QrCode,
  Share2,
  Printer,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { getInvoiceById, deleteInvoice } from '@/services/invoiceApi';
import { getPaymentById, getPixQrCode, resendPaymentEmail } from '@/services/asaasApi';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AsaasPayment } from '@/lib/types';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [pixDialogOpen, setPixDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [boletoDialogOpen, setBoletoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isResending, setIsResending] = useState(false);
  
  // Verifica se é uma nova fatura criada
  const newPayment = location.state?.payment as AsaasPayment | undefined;
  const isNewClient = location.state?.newClient as boolean | undefined;

  // Busca detalhes da fatura no nosso sistema
  const { data: invoice, isLoading: isLoadingInvoice, isError: isErrorInvoice } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(Number(id)),
    enabled: !!id && !newPayment,
  });

  // Busca detalhes do pagamento no Asaas
  const { data: asaasPayment, isLoading: isLoadingAsaas, isError: isErrorAsaas } = useQuery({
    queryKey: ['asaas-payment', id, newPayment?.id],
    queryFn: () => {
      // Se temos um novo pagamento recém-criado, usamos ele diretamente
      if (newPayment) return newPayment;
      
      // Se não, buscamos o pagamento no Asaas usando o ID armazenado em nossa fatura
      if (invoice && invoice.asaasId) {
        return getPaymentById(invoice.asaasId);
      }
      
      // Se não temos ID do Asaas, usamos o ID da rota (pode ser o próprio ID do Asaas)
      return getPaymentById(id || '');
    },
    enabled: !!id || !!newPayment,
  });

  // Busca QR Code PIX quando necessário
  const { data: pixQrCode, isLoading: isLoadingPix, refetch: refetchPixQrCode } = useQuery({
    queryKey: ['pix-qrcode', asaasPayment?.id],
    queryFn: () => getPixQrCode(asaasPayment?.id || ''),
    enabled: !!asaasPayment && asaasPayment.billingType === 'PIX' && pixDialogOpen,
  });

  const isLoading = isLoadingInvoice || isLoadingAsaas;
  const isError = (isErrorInvoice && isErrorAsaas) || (!newPayment && !invoice && !asaasPayment);

  const handleResendEmail = async () => {
    if (!asaasPayment?.id) return;
    
    setIsResending(true);
    
    try {
      const success = await resendPaymentEmail(asaasPayment.id);
      if (success) {
        toast.success('Cobrança reenviada com sucesso!');
      } else {
        toast.error('Erro ao reenviar cobrança. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao reenviar cobrança:', error);
      toast.error('Erro ao reenviar cobrança. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;
    
    const confirmDelete = confirm('Tem certeza que deseja excluir esta fatura?');
    if (!confirmDelete) return;

    try {
      const success = await deleteInvoice(invoice.id);
      if (success) {
        toast.success('Fatura excluída com sucesso');
        navigate('/invoices');
      } else {
        toast.error('Erro ao excluir fatura');
      }
    } catch (error) {
      toast.error('Erro ao excluir fatura');
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
          <CardDescription>Não foi possível carregar os detalhes da fatura</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/invoices')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Faturas
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Determina o status para exibição
  const getStatusDisplay = () => {
    if (asaasPayment) {
      switch (asaasPayment.status) {
        case 'PENDING': return { label: 'Pendente', variant: 'warning' as const };
        case 'RECEIVED': 
        case 'CONFIRMED': return { label: 'Pago', variant: 'success' as const };
        case 'OVERDUE': return { label: 'Vencido', variant: 'destructive' as const };
        default: return { label: asaasPayment.status, variant: 'default' as const };
      }
    }
    
    if (invoice) {
      switch (invoice.status) {
        case 'pending': return { label: 'Pendente', variant: 'warning' as const };
        case 'paid': return { label: 'Pago', variant: 'success' as const };
        case 'cancelled': return { label: 'Cancelado', variant: 'destructive' as const };
        default: return { label: invoice.status, variant: 'default' as const };
      }
    }
    
    return { label: 'Desconhecido', variant: 'default' as const };
  };

  const status = getStatusDisplay();
  const paymentValue = asaasPayment?.value || invoice?.amount || 0;
  const paymentDueDate = asaasPayment?.dueDate || invoice?.dueDate || '';
  const paymentDescription = asaasPayment?.description || invoice?.description || '';
  const invoiceNumber = asaasPayment?.invoiceNumber || invoice?.invoiceNumber || '';
  const paymentDate = asaasPayment?.paymentDate || invoice?.paidDate || '';
  const billingType = asaasPayment?.billingType || 'BOLETO';
  const invoiceUrl = asaasPayment?.invoiceUrl || '';
  const bankSlipUrl = asaasPayment?.bankSlipUrl || '';
  const isPix = billingType === 'PIX';
  const isBoleto = billingType === 'BOLETO';

  return (
    <Card className="max-w-4xl mx-auto animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Fatura {invoiceNumber}</CardTitle>
          <Badge variant={status.variant} className="text-sm">
            {status.label}
          </Badge>
        </div>
        <CardDescription className="text-lg">
          {paymentDescription}
        </CardDescription>
        
        {isNewClient && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Cliente cadastrado com sucesso!</AlertTitle>
            <AlertDescription>
              O cliente foi cadastrado e a fatura foi gerada. Compartilhe esta fatura com o cliente para que ele efetue o pagamento.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mx-4">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="payment" disabled={!asaasPayment}>Pagamento</TabsTrigger>
          <TabsTrigger value="share" disabled={!asaasPayment}>Compartilhar</TabsTrigger>
        </TabsList>
        
        <CardContent className="pt-6">
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Valor
                  </h3>
                  <p className="text-2xl font-bold">{formatCurrency(paymentValue)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <Calendar className="mr-2 h-4 w-4" /> Data de Vencimento
                  </h3>
                  <p>{new Date(paymentDueDate).toLocaleDateString('pt-BR')}</p>
                </div>
                
                {paymentDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Data de Pagamento
                    </h3>
                    <p>{new Date(paymentDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                
                {billingType && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <FileText className="mr-2 h-4 w-4" /> Forma de Pagamento
                    </h3>
                    <p>
                      {billingType === 'BOLETO' && 'Boleto Bancário'}
                      {billingType === 'PIX' && 'PIX'}
                      {billingType === 'CREDIT_CARD' && 'Cartão de Crédito'}
                      {billingType === 'TRANSFER' && 'Transferência'}
                      {billingType === 'DEPOSIT' && 'Depósito'}
                      {billingType === 'UNDEFINED' && 'Não definido'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Detalhes da Fatura</h3>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p>{paymentDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="space-y-6">
              {isPix && (
                <div className="p-6 border rounded-lg flex flex-col items-center justify-center">
                  <QrCode className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="text-lg font-medium mb-2">Pagamento por PIX</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Escaneie o QR Code ou copie o código PIX para pagar esta fatura
                  </p>
                  
                  <Button onClick={() => setPixDialogOpen(true)}>
                    Ver QR Code PIX
                  </Button>
                  
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
                            
                            <Button 
                              variant="ghost" 
                              className="w-full mt-2"
                              onClick={() => refetchPixQrCode()}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar QR Code
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
              )}
              
              {isBoleto && bankSlipUrl && (
                <div className="p-6 border rounded-lg flex flex-col items-center justify-center">
                  <FileText className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="text-lg font-medium mb-2">Boleto Bancário</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Visualize e imprima o boleto para pagamento
                  </p>
                  
                  <div className="flex gap-2">
                    <Button onClick={() => openInNewTab(bankSlipUrl)}>
                      <Printer className="mr-2 h-4 w-4" /> Visualizar Boleto
                    </Button>
                    
                    <Button variant="outline" onClick={() => handleResendEmail()}>
                      {isResending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Reenviar por E-mail
                    </Button>
                  </div>
                </div>
              )}
              
              {invoiceUrl && (
                <div className="p-6 border rounded-lg flex flex-col items-center justify-center">
                  <FileText className="h-10 w-10 mb-4 text-secondary" />
                  <h3 className="text-lg font-medium mb-2">Fatura Online</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Acesse a fatura online para mais opções de pagamento
                  </p>
                  
                  <Button variant="secondary" onClick={() => openInNewTab(invoiceUrl)}>
                    Acessar Fatura Online
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="share">
            <div className="space-y-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Compartilhar Fatura</h3>
                
                <div className="space-y-4">
                  {invoiceUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Link da Fatura</h4>
                      <div className="flex items-center">
                        <input 
                          type="text" 
                          readOnly 
                          value={invoiceUrl} 
                          className="flex-1 p-2 border rounded-l-md text-sm bg-muted h-10"
                        />
                        <Button 
                          className="rounded-l-none" 
                          onClick={() => copyToClipboard(invoiceUrl, 'Link da fatura copiado!')}
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (invoiceUrl) {
                          window.open(`https://wa.me/?text=${encodeURIComponent(`Fatura ${invoiceNumber} - ${formatCurrency(paymentValue)}: ${invoiceUrl}`)}`, '_blank');
                        }
                      }}
                      disabled={!invoiceUrl}
                    >
                      Compartilhar via WhatsApp
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (invoiceUrl) {
                          window.open(`mailto:?subject=Fatura ${invoiceNumber}&body=${encodeURIComponent(`Fatura ${invoiceNumber} - ${formatCurrency(paymentValue)}: ${invoiceUrl}`)}`, '_blank');
                        }
                      }}
                      disabled={!invoiceUrl}
                    >
                      Compartilhar via E-mail
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex flex-wrap gap-3 justify-between pt-6">
        <Button variant="outline" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <div className="flex flex-wrap gap-3">
          {user?.role !== 'client' && invoice && (
            <>
              <Button variant="outline" onClick={() => navigate(`/invoices/edit/${invoice.id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
              
              <Button variant="outline" onClick={handleDeleteInvoice}>
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </Button>
            </>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleResendEmail}
            disabled={isResending || !asaasPayment}
          >
            {isResending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Reenviar
          </Button>
          
          {(bankSlipUrl || invoiceUrl) && (
            <Button onClick={() => openInNewTab(bankSlipUrl || invoiceUrl)}>
              <Download className="mr-2 h-4 w-4" /> {isBoleto ? 'Boleto' : 'Fatura'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvoiceDetail;
