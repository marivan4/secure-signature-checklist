
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { createInvoice, getInvoiceById, updateInvoice } from '@/services/invoiceApi';
import { getChecklists } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

// Schema para validação do formulário
const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Número da fatura é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.coerce.number().positive('Valor deve ser maior que zero'),
  status: z.enum(['pending', 'paid', 'cancelled']),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  paidDate: z.string().optional(),
  checklistId: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  billingType: z.enum(['BOLETO', 'PIX', 'CREDIT_CARD']).optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  const [error, setError] = React.useState<string | null>(null);

  // Busca a fatura se estiver editando
  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(Number(id)),
    enabled: isEditing,
  });

  // Busca checklists para associar à fatura
  const { data: checklistsResponse = [] } = useQuery({
    queryKey: ['checklists-select'],
    queryFn: () => getChecklists(),
  });
  
  // Extrair os checklists da resposta da API
  const checklists = Array.isArray(checklistsResponse) 
    ? checklistsResponse 
    : checklistsResponse.data || [];

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: '',
      description: '',
      amount: 0,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      paidDate: '',
      checklistId: '',
      email: '',
      phone: '',
      billingType: 'BOLETO',
    },
  });

  // Preenche o formulário com os dados da fatura quando disponíveis
  React.useEffect(() => {
    if (invoice && isEditing) {
      form.reset({
        invoiceNumber: invoice.invoiceNumber,
        description: invoice.description,
        amount: invoice.amount,
        status: invoice.status,
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
        paidDate: invoice.paidDate ? new Date(invoice.paidDate).toISOString().split('T')[0] : '',
        checklistId: invoice.checklistId ? String(invoice.checklistId) : '',
        email: invoice.email || '',
        phone: invoice.phone || '',
        billingType: invoice.billingType || 'BOLETO',
      });
    }
  }, [invoice, isEditing, form]);

  // Mutação para criar/atualizar fatura
  const mutation = useMutation({
    mutationFn: async (values: InvoiceFormValues) => {
      setError(null);
      console.log('Enviando dados de fatura:', values);
      
      // Create a properly typed object that matches the required Invoice fields
      const formattedValues = {
        invoiceNumber: values.invoiceNumber,
        description: values.description,
        amount: Number(values.amount),
        status: values.status,
        dueDate: values.dueDate,
        userId: user?.id || 0,
        paidDate: values.paidDate || undefined,
        checklistId: values.checklistId && values.checklistId !== 'none' ? Number(values.checklistId) : undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        billingType: values.billingType || 'BOLETO',
      };

      try {
        if (isEditing) {
          return await updateInvoice(Number(id), formattedValues);
        } else {
          return await createInvoice(formattedValues);
        }
      } catch (error) {
        console.error('Erro na mutação:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao processar fatura');
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(
        isEditing ? 'Fatura atualizada com sucesso' : 'Fatura criada com sucesso'
      );
      navigate('/invoices');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? `Erro: ${error.message}` 
        : 'Erro ao processar fatura. Verifique os dados e tente novamente.';
      
      toast.error(errorMessage);
      setError(errorMessage);
    },
  });

  const onSubmit = (values: InvoiceFormValues) => {
    mutation.mutate(values);
  };

  if (isEditing && isLoadingInvoice) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Fatura' : 'Nova Fatura'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Atualize os detalhes da fatura existente' 
            : 'Preencha os detalhes para criar uma nova fatura'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Erro ao processar fatura</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Fatura</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-2023-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checklistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contrato Relacionado (Opcional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um contrato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {checklists.map((checklist) => (
                          <SelectItem key={checklist.id} value={String(checklist.id)}>
                            {checklist.name} - {checklist.licensePlate || 'Sem placa'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="paid">Paga</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paidDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Pagamento (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Cliente (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cliente@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Cliente (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(99) 99999-9999" {...field} />
                    </FormControl>
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
                      defaultValue={field.value || 'BOLETO'}
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os detalhes da fatura" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-between px-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/invoices')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Atualizar Fatura' : 'Criar Fatura'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
