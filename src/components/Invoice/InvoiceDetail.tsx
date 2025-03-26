
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { getInvoiceById, deleteInvoice } from '@/services/invoiceApi';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: invoice, isLoading, isError } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !invoice) {
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

  const handleDeleteInvoice = async () => {
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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Fatura {invoice.invoiceNumber}</CardTitle>
          <Badge 
            variant={
              invoice.status === 'paid' ? 'success' : 
              invoice.status === 'pending' ? 'warning' : 
              'destructive'
            }
            className="text-sm"
          >
            {invoice.status === 'paid' ? 'Paga' : 
             invoice.status === 'pending' ? 'Pendente' : 
             'Cancelada'}
          </Badge>
        </div>
        <CardDescription className="text-lg">
          {invoice.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <CreditCard className="mr-2 h-4 w-4" /> Valor
              </h3>
              <p className="text-2xl font-bold">{formatCurrency(invoice.amount)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Data de Emissão
              </h3>
              <p>{new Date(invoice.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-2 h-4 w-4" /> Data de Vencimento
              </h3>
              <p>{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</p>
            </div>
            
            {invoice.paidDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Data de Pagamento
                </h3>
                <p>{new Date(invoice.paidDate).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Detalhes da Fatura</h3>
              <div className="mt-2 p-4 bg-muted rounded-lg">
                <p>{invoice.description}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-3 justify-between">
        <Button variant="outline" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <div className="flex flex-wrap gap-3">
          {user?.role !== 'client' && (
            <>
              <Button variant="outline" onClick={() => navigate(`/invoices/edit/${invoice.id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
              
              <Button variant="outline" onClick={handleDeleteInvoice}>
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </Button>
            </>
          )}
          
          <Button variant="outline" onClick={() => navigate(`/invoices/${invoice.id}/send`)}>
            <Send className="mr-2 h-4 w-4" /> Enviar
          </Button>
          
          <Button onClick={() => navigate(`/invoices/${invoice.id}/export`)}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvoiceDetail;
