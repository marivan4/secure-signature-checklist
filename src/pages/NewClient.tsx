
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  FileText,
  BuildingIcon,
  UserIcon,
  Check
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createCustomer, createPayment } from '@/services/asaasApi';
import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

// Schema para validação do formulário
const clientSchema = z.object({
  // Dados do cliente
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ é obrigatório'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  
  // Endereço
  postalCode: z.string().min(8, 'CEP é obrigatório'),
  address: z.string().min(3, 'Endereço é obrigatório'),
  addressNumber: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  province: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  
  // Faturamento
  billingType: z.enum(['BOLETO', 'PIX', 'CREDIT_CARD']),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const NewClient: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Obtém o plano selecionado da URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    if (plan) {
      setSelectedPlanId(plan);
    } else {
      // Se não houver plano selecionado, redireciona para a página de planos
      navigate('/plans');
    }
  }, [location, navigate]);

  // Lista de planos disponíveis
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Ideal para pequenas frotas',
      price: 79.90,
      features: [
        'Rastreamento em tempo real',
        'Histórico de 30 dias',
        'Suporte em horário comercial',
        'Bloqueio remoto',
        '1 veículo'
      ],
      durationMonths: 1,
      color: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Perfeito para frotas médias',
      price: 159.90,
      features: [
        'Rastreamento em tempo real',
        'Histórico de 90 dias',
        'Suporte 24/7',
        'Bloqueio remoto',
        'Relatórios avançados',
        'Até 5 veículos'
      ],
      durationMonths: 1,
      color: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Solução completa para frotas',
      price: 299.90,
      features: [
        'Rastreamento em tempo real',
        'Histórico ilimitado',
        'Suporte prioritário 24/7',
        'Bloqueio remoto',
        'Relatórios avançados',
        'API de integração',
        'Veículos ilimitados'
      ],
      durationMonths: 1,
      color: 'bg-green-100 dark:bg-green-900',
    }
  ];
  
  // Encontra o plano selecionado
  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      cpfCnpj: '',
      phone: '',
      postalCode: '',
      address: '',
      addressNumber: '',
      complement: '',
      province: '',
      city: '',
      state: '',
      billingType: 'BOLETO',
    },
  });

  const handleSubmit = async (values: ClientFormValues) => {
    if (!selectedPlan) {
      toast.error('Plano não encontrado. Por favor, selecione um plano para continuar.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Cria o cliente no Asaas
      const customer = await createCustomer({
        name: values.name,
        email: values.email,
        cpfCnpj: values.cpfCnpj.replace(/[^\d]/g, ''),
        phone: values.phone,
        mobilePhone: values.phone,
        postalCode: values.postalCode.replace(/[^\d]/g, ''),
        address: values.address,
        addressNumber: values.addressNumber,
        complement: values.complement,
        province: values.province,
      });

      if (!customer || !customer.id) {
        throw new Error('Falha ao criar cliente no Asaas');
      }

      // 2. Cria o pagamento no Asaas
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

      const payment = await createPayment({
        customer: customer.id,
        billingType: values.billingType,
        value: selectedPlan.price,
        dueDate: dueDate.toISOString().split('T')[0],
        description: `Assinatura Plano ${selectedPlan.name} - Rastreamento de veículos`,
        externalReference: `plan_${selectedPlan.id}`,
      });

      if (!payment) {
        throw new Error('Falha ao criar pagamento no Asaas');
      }

      // 3. Redireciona para a página de sucesso
      navigate(`/invoices/${payment.id}`, { state: { newClient: true, payment } });
      toast.success('Cliente cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast.error('Erro ao cadastrar cliente. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="container py-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Plano não encontrado</CardTitle>
            <CardDescription>Por favor, selecione um plano para continuar.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/plans')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Planos
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 animate-fade-in max-w-5xl">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/plans')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cadastro de Cliente</h1>
          <p className="text-muted-foreground">Plano selecionado: {selectedPlan.name} - {formatCurrency(selectedPlan.price)}/mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detalhes do plano */}
        <Card>
          <div className={`h-2 w-full ${selectedPlan.color}`} />
          <CardHeader>
            <CardTitle>Plano {selectedPlan.name}</CardTitle>
            <CardDescription>{selectedPlan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold">{formatCurrency(selectedPlan.price)}</div>
              <p className="text-muted-foreground text-sm">Faturado mensalmente</p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="font-medium">Recursos incluídos:</h3>
              <ul className="space-y-1 text-sm">
                {selectedPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Formulário de cadastro */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>
                Preencha os dados para criar um novo cliente e gerar a fatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="personal" className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2" /> Dados Pessoais
                      </TabsTrigger>
                      <TabsTrigger value="billing" className="flex items-center">
                        <BuildingIcon className="h-4 w-4 mr-2" /> Endereço
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="personal" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome completo" {...field} />
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
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cpfCnpj"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF/CNPJ</FormLabel>
                              <FormControl>
                                <Input placeholder="000.000.000-00" {...field} />
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
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="billing" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CEP</FormLabel>
                              <FormControl>
                                <Input placeholder="00000-000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Endereço</FormLabel>
                              <FormControl>
                                <Input placeholder="Rua, Avenida, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="addressNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="complement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input placeholder="Apt, Sala, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bairro</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu bairro" {...field} />
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
                                <Input placeholder="Sua cidade" {...field} />
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
                                <Input placeholder="UF" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Forma de Pagamento</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="billingType"
                        render={({ field }) => (
                          <>
                            <div 
                              className={`border rounded-md p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors ${field.value === 'BOLETO' ? 'border-primary bg-primary/5' : ''}`}
                              onClick={() => form.setValue('billingType', 'BOLETO')}
                            >
                              <FileText className="h-6 w-6" />
                              <span className="text-sm font-medium">Boleto</span>
                            </div>
                            
                            <div 
                              className={`border rounded-md p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors ${field.value === 'PIX' ? 'border-primary bg-primary/5' : ''}`}
                              onClick={() => form.setValue('billingType', 'PIX')}
                            >
                              <QrCode className="h-6 w-6" />
                              <span className="text-sm font-medium">PIX</span>
                            </div>
                            
                            <div 
                              className={`border rounded-md p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors ${field.value === 'CREDIT_CARD' ? 'border-primary bg-primary/5' : ''}`}
                              onClick={() => form.setValue('billingType', 'CREDIT_CARD')}
                            >
                              <CreditCard className="h-6 w-6" />
                              <span className="text-sm font-medium">Cartão</span>
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Cadastrar e Gerar Fatura
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewClient;
