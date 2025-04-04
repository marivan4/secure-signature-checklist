
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Form validation schema
const resellerFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  address: z.string().min(5, { message: 'Endereço é obrigatório' }),
  city: z.string().min(2, { message: 'Cidade é obrigatória' }),
  state: z.string().min(2, { message: 'Estado é obrigatório' }),
  zipCode: z.string().min(8, { message: 'CEP é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone é obrigatório' }),
  contactName: z.string().min(3, { message: 'Nome do contato é obrigatório' }),
  contactPhone: z.string().min(10, { message: 'Telefone do contato é obrigatório' }),
  status: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  asaasConfigured: z.boolean().default(false)
});

type ResellerFormValues = z.infer<typeof resellerFormSchema>;

const ResellerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Mock data for editing (in a real app, fetch this from API)
  const defaultValues: ResellerFormValues = isEditMode 
    ? {
        name: 'Rastreadores São Paulo',
        address: 'Av. Paulista, 1578',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-200',
        email: 'contato@rastreadores-sp.com.br',
        phone: '(11) 3456-7890',
        contactName: 'Carlos Silva',
        contactPhone: '(11) 98765-4321',
        status: 'active',
        description: 'Uma das principais revendas de rastreadores no estado de São Paulo, com foco em atendimento personalizado e soluções para frotas empresariais.',
        logoUrl: 'https://via.placeholder.com/200',
        asaasConfigured: true
      }
    : {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        phone: '',
        contactName: '',
        contactPhone: '',
        status: 'pending',
        description: '',
        logoUrl: '',
        asaasConfigured: false
      };
  
  const form = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerFormSchema),
    defaultValues
  });
  
  const onSubmit = (data: ResellerFormValues) => {
    console.log('Form data:', data);
    
    // In a real app, send this data to your API
    // Simulate API call with a timeout
    setTimeout(() => {
      toast({
        title: isEditMode ? "Revenda atualizada" : "Revenda criada",
        description: `${data.name} foi ${isEditMode ? 'atualizada' : 'criada'} com sucesso.`,
      });
      
      // Redirect to resellers list or detail page
      navigate(isEditMode ? `/resellers/${id}` : '/resellers');
    }, 1000);
  };

  return (
    <div className="container py-6 md:py-10 px-4 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link to={isEditMode ? `/resellers/${id}` : '/resellers'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? 'Editar Revenda' : 'Nova Revenda'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Informações principais da revenda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Revenda</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da revenda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Logo</FormLabel>
                    <FormControl>
                      <Input placeholder="URL da imagem do logo" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL para a imagem do logo da revenda (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a revenda, seus diferenciais e áreas de atuação" 
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
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="inactive">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>
                Endereço físico da revenda
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Estado (UF)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="CEP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Dados para contato com a revenda
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
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
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da pessoa de contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Integração</CardTitle>
              <CardDescription>
                Configurações para integração com sistemas de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="asaasConfigured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Integração Asaas</FormLabel>
                      <FormDescription>
                        Ativar a integração com o Asaas para esta revenda
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="lg"
              className="w-full md:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Salvar Alterações' : 'Criar Revenda'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResellerForm;
