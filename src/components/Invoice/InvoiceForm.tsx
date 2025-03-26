
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
import { Loader2 } from 'lucide-react';
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
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

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
      });
    }
  }, [invoice, isEditing, form]);

  // Mutação para criar/atualizar fatura
  const mutation = useMutation({
    mutationFn: async (values: InvoiceFormValues) => {
      const formattedValues = {
        ...values,
        amount: Number(values.amount),
        userId: user?.id || 0,
        invoiceNumber: values.invoiceNumber, // Ensure this is included and required
        description: values.description, // Ensure this is included and required
        status: values.status, // Ensure this is included and required
        dueDate: values.dueDate, // Ensure this is included and required
        checklistId: values.checklistId ? Number(values.checklistId) : undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
      };

      if (isEditing) {
        return updateInvoice(Number(id), formattedValues);
      } else {
        return createInvoice(formattedValues);
      }
    },
    onSuccess: () => {
      toast.success(
        isEditing ? 'Fatura atualizada com sucesso' : 'Fatura criada com sucesso'
      );
      navigate('/invoices');
    },
    onError: () => {
      toast.error(
        isEditing ? 'Erro ao atualizar fatura' : 'Erro ao criar fatura'
      );
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
                        <SelectItem value="">Nenhum</SelectItem>
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
                        min="0"
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
