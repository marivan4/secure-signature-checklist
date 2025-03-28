
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Tracker } from '@/lib/types';

// Schema para validação do formulário
const trackerSchema = z.object({
  imei: z.string().min(15, 'IMEI deve ter no mínimo 15 dígitos'),
  model: z.string().min(2, 'Modelo é obrigatório'),
  status: z.enum(['active', 'inactive', 'maintenance', 'blocked']),
  simCardNumber: z.string().optional(),
  notes: z.string().optional(),
  installationDate: z.string().optional()
});

type TrackerFormValues = z.infer<typeof trackerSchema>;

const TrackerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicializa o formulário
  const form = useForm<TrackerFormValues>({
    resolver: zodResolver(trackerSchema),
    defaultValues: {
      imei: '',
      model: '',
      status: 'inactive',
      simCardNumber: '',
      notes: '',
      installationDate: new Date().toISOString().split('T')[0]
    },
  });

  // Carrega os dados do rastreador se estiver em modo de edição
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // Aqui você buscaria os dados do rastreador pelo ID
      // Simularemos com um delay e dados fictícios
      setTimeout(() => {
        const trackerData: Tracker = {
          id: Number(id),
          userId: 1,
          imei: '123456789012345',
          model: 'GT06N',
          status: 'active',
          simCardNumber: '5511999999999',
          notes: 'Instalado no veículo do cliente X',
          installationDate: '2023-05-15',
          createdAt: '2023-05-15'
        };
        
        form.reset({
          imei: trackerData.imei,
          model: trackerData.model,
          status: trackerData.status,
          simCardNumber: trackerData.simCardNumber,
          notes: trackerData.notes,
          installationDate: trackerData.installationDate
        });
        
        setIsLoading(false);
      }, 500);
    }
  }, [form, id, isEditMode]);

  const onSubmit = async (values: TrackerFormValues) => {
    setIsLoading(true);
    try {
      // Aqui você implementaria a lógica de API para salvar o rastreador
      // Simulando um delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Dados do rastreador enviados:', values);
      
      toast.success(
        isEditMode 
          ? 'Rastreador atualizado com sucesso!' 
          : 'Rastreador cadastrado com sucesso!'
      );
      
      // Redireciona para a lista de rastreadores após salvar
      navigate('/trackers');
    } catch (error) {
      console.error('Erro ao salvar rastreador:', error);
      toast.error('Erro ao salvar rastreador. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/trackers')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditMode ? 'Editar Rastreador' : 'Novo Rastreador'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Atualize as informações do rastreador' 
              : 'Preencha os dados para cadastrar um novo rastreador'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Rastreador</CardTitle>
          <CardDescription>
            Informações técnicas e de identificação do dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="imei"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IMEI</FormLabel>
                      <FormControl>
                        <Input placeholder="Número IMEI do rastreador" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número de identificação único do dispositivo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Modelo do rastreador" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="simCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do SIM Card</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do chip" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="installationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Instalação</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                          <SelectItem value="maintenance">Em Manutenção</SelectItem>
                          <SelectItem value="blocked">Bloqueado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações sobre o rastreador"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4" />
                  {isEditMode ? 'Atualizar Rastreador' : 'Cadastrar Rastreador'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackerForm;
