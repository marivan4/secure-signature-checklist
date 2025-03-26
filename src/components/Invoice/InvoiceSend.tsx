
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Loader2, 
  ArrowLeft, 
  Mail, 
  MessageSquare 
} from 'lucide-react';
import { toast } from 'sonner';
import { getInvoiceById, sendInvoiceByEmail, sendInvoiceByWhatsApp } from '@/services/invoiceApi';

const InvoiceSend: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  
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

  // Preencher email do cliente se disponível no invoice
  React.useEffect(() => {
    if (invoice && invoice.email) {
      setEmail(invoice.email);
    }
    
    // Se tiver telefone, preenche também
    if (invoice && invoice.phone) {
      setPhone(invoice.phone.replace(/\D/g, ''));
    }
  }, [invoice]);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    try {
      setSending(true);
      const success = await sendInvoiceByEmail(invoice.id, email);
      
      if (success) {
        toast.success('Fatura enviada por email com sucesso');
      } else {
        toast.error('Erro ao enviar fatura por email');
      }
    } catch (error) {
      toast.error('Erro ao enviar fatura por email');
    } finally {
      setSending(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!phone) {
      toast.error('Por favor, insira um número de telefone válido');
      return;
    }

    try {
      setSending(true);
      
      // Formata o número para o padrão brasileiro - 55 + DDD + número
      let formattedPhone = phone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('55')) {
        formattedPhone = `55${formattedPhone}`;
      }
      
      const success = await sendInvoiceByWhatsApp(invoice.id, formattedPhone);
      
      if (success) {
        toast.success('Fatura enviada por WhatsApp com sucesso');
      } else {
        toast.error('Erro ao enviar fatura por WhatsApp');
      }
    } catch (error) {
      toast.error('Erro ao enviar fatura por WhatsApp');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Enviar Fatura</CardTitle>
        <CardDescription>
          Envie a fatura {invoice.invoiceNumber} por e-mail ou WhatsApp
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" /> E-mail
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail do destinatário</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleSendEmail} 
              disabled={sending || !email}
              className="w-full"
            >
              {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar por E-mail
            </Button>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(99) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Formato: DDD + número (ex: 11999999999)
              </p>
            </div>
            
            <Button 
              onClick={handleSendWhatsApp} 
              disabled={sending || !phone}
              className="w-full"
            >
              {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar por WhatsApp
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" onClick={() => navigate(`/invoices/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceSend;
