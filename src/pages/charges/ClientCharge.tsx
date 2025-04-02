
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createInvoice } from '@/services/invoiceApi';
import { ArrowLeft, CreditCard, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { Invoice } from '@/lib/types';

const formSchema = z.object({
  description: z.string().min(3, { message: 'A descrição deve ter pelo menos 3 caracteres' }),
  amount: z.coerce.number().min(0.01, { message: 'O valor deve ser maior que zero' }),
  dueDate: z.string().min(1, { message: 'A data de vencimento é obrigatória' }),
  billingType: z.enum(['BOLETO', 'PIX', 'CREDIT_CARD']),
});

type FormValues = z.infer<typeof formSchema>;

const ClientCharge: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      billingType: 'BOLETO',
    },
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!import.meta.env.PROD) {
          setClientData({
            id: clientId,
            name: `Cliente ${clientId}`,
            email: `cliente${clientId}@exemplo.com`,
            phone: '(11) 98765-4321',
            cpfCnpj: '123.456.789-00',
          });
        } else {
          const response = await fetch(`/api/clients/${clientId}`);
          const data = await response.json();
          setClientData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do cliente:', error);
        toast.error('Não foi possível carregar os dados do cliente');
        setError('Erro ao carregar dados do cliente');
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const onSubmit = async (values: FormValues) => {
    if (!clientId || !clientData) {
      toast.error('Dados do cliente não disponíveis');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Validando o valor
      if (values.amount <= 0) {
        throw new Error('O valor da cobrança deve ser maior que zero');
      }
      
      // Validando a data de vencimento
      const dueDate = new Date(values.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        throw new Error('A data de vencimento não pode ser anterior à data atual');
      }
      
      // Gerar número de fatura único
      const invoiceNumber = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const invoice: Omit<Invoice, 'id' | 'createdAt'> = {
        userId: parseInt(clientId),
        description: values.description,
        amount: values.amount,
        dueDate: values.dueDate,
        status: 'pending', // Usando um valor literal do tipo esperado
        invoiceNumber: invoiceNumber,
        email: clientData.email,
        phone: clientData.phone,
        billingType: values.billingType,
      };

      console.log('Enviando dados da fatura:', invoice);
      const result = await createInvoice(invoice);
      
      if (result) {
        toast.success('Cobrança criada com sucesso');
        navigate(`/invoices/${result.id}`);
      } else {
        throw new Error('Não foi possível criar a cobrança. Verifique os dados e tente novamente');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar cobrança';
      console.error('Erro ao criar cobrança:', error);
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!clientData) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-32">
              <p>Carregando dados do cliente...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Nova Cobrança Avulsa</h1>
          <p className="text-muted-foreground mt-1">
            Crie uma cobrança avulsa para o cliente {clientData.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Cliente</CardTitle>
          <CardDescription>Informações do cliente para quem a cobrança será emitida</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <p className="font-medium">{clientData.name}</p>
            </div>
            <div>
              <Label>CPF/CNPJ</Label>
              <p className="font-medium">{clientData.cpfCnpj}</p>
            </div>
            <div>
              <Label>E-mail</Label>
              <p className="font-medium">{clientData.email}</p>
            </div>
            <div>
              <Label>Telefone</Label>
              <p className="font-medium">{clientData.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md mt-6">
          <p className="font-medium">Erro ao criar cobrança</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Cobrança</CardTitle>
          <CardDescription>Preencha as informações da cobrança</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="charge-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descreva o motivo da cobrança" {...field} />
                    </FormControl>
                    <FormDescription>
                      Uma descrição clara ajuda o cliente a entender a cobrança
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        min={getMinDate()} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A data de vencimento deve ser maior ou igual à data atual
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma forma de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BOLETO">Boleto Bancário</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="charge-form" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Criar Cobrança
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientCharge;
