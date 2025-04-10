
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Shield, RefreshCw, Users, Building } from 'lucide-react';
import { getAsaasConfig, saveAsaasConfig, initAsaasApi, getAllAsaasConfigs } from '@/services/asaasApi';
import { getAsaasBaseUrl } from '@/services/apiConfig';
import { generateMonthlyInvoices, checkOverdueInvoicesAndBlock } from '@/services/invoiceApi';
import { AsaasConfig } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  apiKey: z.string().min(8, {
    message: 'O token de acesso deve ter pelo menos 8 caracteres',
  }),
  sandbox: z.boolean().default(true),
});

const AsaasSettings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [isSandbox, setIsSandbox] = useState(true);
  const [allConfigs, setAllConfigs] = useState<AsaasConfig[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReseller, setIsReseller] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
      sandbox: true,
    },
  });

  useEffect(() => {
    let isMounted = true;

    if (user?.role === 'admin' && isMounted) {
      setIsAdmin(true);
      fetchAllConfigs();
    }
    
    if (user?.role === 'reseller' && isMounted) {
      setIsReseller(true);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const fetchAllConfigs = async () => {
    if (user?.role === 'admin') {
      try {
        const configs = await getAllAsaasConfigs();
        setAllConfigs(configs);
      } catch (error) {
        console.error('Erro ao buscar todas as configurações do Asaas:', error);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      if (user?.id && (user.role === 'admin' || user.role === 'manager' || user.role === 'reseller')) {
        setIsLoading(true);
        try {
          const config = await getAsaasConfig(user.id);
          
          if (!isMounted) return;
          
          if (config) {
            form.reset({
              apiKey: config.apiKey,
              sandbox: config.sandbox,
            });
            setIsSandbox(config.sandbox);
            setConfigLoaded(true);
            
            initAsaasApi(config);
          }
        } catch (error) {
          if (!isMounted) return;
          console.error('Erro ao carregar configuração do Asaas:', error);
          toast.error('Não foi possível carregar a configuração do Asaas');
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const config: AsaasConfig = {
        apiKey: values.apiKey,
        sandbox: values.sandbox,
        userId: user.id,
        userRole: user.role
      };
      
      const savedConfig = await saveAsaasConfig(config);
      if (savedConfig) {
        toast.success('Configuração do Asaas salva com sucesso');
        setConfigLoaded(true);
        setIsSandbox(values.sandbox);
        
        initAsaasApi(config);
        
        if (user.role === 'admin') {
          fetchAllConfigs();
        }
      } else {
        toast.error('Erro ao salvar configuração do Asaas');
      }
    } catch (error) {
      console.error('Erro ao salvar configuração do Asaas:', error);
      toast.error('Erro ao salvar configuração do Asaas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInvoices = async () => {
    setIsLoading(true);
    try {
      const success = await generateMonthlyInvoices();
      if (success) {
        toast.success('Mensalidades geradas com sucesso');
      } else {
        toast.error('Erro ao gerar mensalidades');
      }
    } catch (error) {
      console.error('Erro ao gerar mensalidades:', error);
      toast.error('Erro ao gerar mensalidades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOverdueInvoices = async () => {
    setIsLoading(true);
    try {
      const success = await checkOverdueInvoicesAndBlock();
      if (success) {
        toast.success('Verificação concluída com sucesso');
      } else {
        toast.error('Erro ao verificar faturas vencidas');
      }
    } catch (error) {
      console.error('Erro ao verificar faturas vencidas:', error);
      toast.error('Erro ao verificar faturas vencidas');
    } finally {
      setIsLoading(false);
    }
  };

  const renderApiInfo = () => {
    if (configLoaded) {
      return (
        <div className="text-xs text-muted-foreground mt-2">
          <p>API URL: {getAsaasBaseUrl()}</p>
        </div>
      );
    }
    return null;
  };

  // Only admins, resellers and managers can access this page
  if (!user || (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'reseller')) {
    return null;
  }

  return (
    <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Asaas</h1>
          <p className="text-muted-foreground mt-1">
            Configure a integração com a plataforma Asaas para processamento de pagamentos
          </p>
        </div>
      </div>

      {isSandbox && (
        <Alert variant="default" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Modo Sandbox Ativado</AlertTitle>
          <AlertDescription>
            O sistema está configurado para usar o ambiente de testes (sandbox) do Asaas. Pagamentos não serão processados no ambiente real.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Credenciais do Asaas
            </CardTitle>
            <CardDescription>
              Configure as credenciais de acesso à API do Asaas para processamento de pagamentos
              {isReseller && ' da sua revenda'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de Acesso (API Key)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Insira o token de acesso do Asaas"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormDescription>
                        Você pode obter seu token de acesso no painel do Asaas em Configurações &gt; Integrações
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sandbox"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Modo Sandbox</FormLabel>
                        <FormDescription>
                          Ativar o modo de testes (sandbox) do Asaas para testar a integração sem processar pagamentos reais
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

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Configurações'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Configurações de Administradores
              </CardTitle>
              <CardDescription>
                Visualize as configurações do Asaas para todos os administradores e revendas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ambiente</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allConfigs.length > 0 ? (
                    allConfigs.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell>{config.id}</TableCell>
                        <TableCell>
                          {config.userRole === 'reseller' 
                            ? <span className="flex items-center"><Building className="h-3 w-3 mr-1 text-blue-500" /> Revenda #{config.userId}</span>
                            : <span className="flex items-center"><Shield className="h-3 w-3 mr-1 text-purple-500" /> Admin #{config.userId}</span>
                          }
                        </TableCell>
                        <TableCell>{config.userRole === 'reseller' ? 'Revenda' : 'Administrador'}</TableCell>
                        <TableCell>{config.sandbox ? 'Sandbox' : 'Produção'}</TableCell>
                        <TableCell>
                          {config.apiKey && config.apiKey.length > 16 ? 
                            `${config.apiKey.substring(0, 8)}...${config.apiKey.substring(config.apiKey.length - 8)}` : 
                            '******'}
                        </TableCell>
                        <TableCell>{config.createdAt ? new Date(config.createdAt).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhuma configuração encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {configLoaded && (user?.role === 'admin' || user?.role === 'reseller') && (
          <Card>
            <CardHeader>
              <CardTitle>Ações de Faturamento</CardTitle>
              <CardDescription>
                Geração de mensalidades e verificação de pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Geração Automática de Mensalidades</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gere mensalidades automaticamente para todos os clientes com base nos veículos cadastrados.
                  Normalmente este processo é executado automaticamente no início de cada mês.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleGenerateInvoices}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Gerar Mensalidades Agora'
                  )}
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Verificação de Faturas Vencidas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Verifica faturas vencidas e bloqueia automaticamente os rastreadores dos clientes com pagamentos em atraso.
                  Normalmente este processo é executado automaticamente todos os dias.
                </p>
                <Button 
                  variant="outline"
                  onClick={handleCheckOverdueInvoices}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar Faturas Vencidas'
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </p>
              {renderApiInfo()}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AsaasSettings;
