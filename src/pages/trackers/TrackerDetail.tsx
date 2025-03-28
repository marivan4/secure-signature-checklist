import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Ban, 
  Signal, 
  MapPin, 
  Calendar, 
  Smartphone, 
  Battery, 
  CalendarClock,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tracker } from '@/lib/types';

const TrackerDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    // Skip if not mounted
    if (!isMounted) return;
    
    // Cleanup function to handle component unmounting during data fetch
    let isActive = true;
    
    const loadTracker = async () => {
      setIsLoading(true);
      try {
        // Simulação de requisição
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Skip update if component unmounted
        if (!isActive) return;
        
        const trackerData: Tracker = {
          id: Number(id),
          userId: 1,
          imei: '123456789012345',
          model: 'GT06N',
          status: 'active',
          simCardNumber: '5511999999999',
          notes: 'Instalado no veículo do cliente João Silva. Honda Civic prata, placa ABC-1234.',
          installationDate: '2023-05-15',
          lastTransmissionDate: '2023-10-20T14:35:00Z',
          batteryLevel: 85,
          createdAt: '2023-05-15'
        };
        
        setTracker(trackerData);
      } catch (error) {
        // Skip update if component unmounted
        if (!isActive) return;
        
        console.error('Erro ao carregar dados do rastreador:', error);
        toast.error('Erro ao carregar dados do rastreador');
      } finally {
        // Skip update if component unmounted
        if (!isActive) return;
        
        setIsLoading(false);
      }
    };

    loadTracker();
    
    return () => {
      isActive = false;
    };
  }, [id, isMounted]);

  const handleDelete = async () => {
    if (!isMounted) return;
    
    setIsDeleteLoading(true);
    try {
      // Aqui você implementaria a lógica para excluir o rastreador
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isMounted) return;
      
      toast.success('Rastreador excluído com sucesso!');
      navigate('/trackers');
    } catch (error) {
      if (!isMounted) return;
      
      console.error('Erro ao excluir rastreador:', error);
      toast.error('Erro ao excluir rastreador');
    } finally {
      if (!isMounted) return;
      
      setIsDeleteLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!tracker || !isMounted) return;
    
    setIsBlockLoading(true);
    try {
      // Aqui você implementaria a lógica para bloquear/desbloquear o rastreador
      const newStatus = tracker.status === 'blocked' ? 'active' : 'blocked';
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isMounted) return;
      
      setTracker({ ...tracker, status: newStatus as any });
      
      toast.success(
        newStatus === 'blocked' 
          ? 'Rastreador bloqueado com sucesso!' 
          : 'Rastreador desbloqueado com sucesso!'
      );
    } catch (error) {
      if (!isMounted) return;
      
      console.error('Erro ao alterar status do rastreador:', error);
      toast.error('Erro ao alterar status do rastreador');
    } finally {
      if (!isMounted) return;
      
      setIsBlockLoading(false);
      setIsBlockDialogOpen(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Inativo</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manutenção</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tracker) {
    return (
      <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Rastreador não encontrado</CardTitle>
            <CardDescription>
              O rastreador que você está procurando não existe ou foi removido.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/trackers')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Rastreadores
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/trackers')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detalhes do Rastreador</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">
                IMEI: {tracker.imei}
              </p>
              {getStatusBadge(tracker.status)}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/trackers/edit/${tracker.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir este rastreador? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleteLoading}>
                  {isDeleteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Excluir Rastreador
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Rastreador</CardTitle>
            <CardDescription>Detalhes técnicos e informações do dispositivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Modelo</p>
                <p className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                  {tracker.model}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IMEI</p>
                <p>{tracker.imei}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Número do SIM Card</p>
                <p>{tracker.simCardNumber || 'Não informado'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p>{getStatusBadge(tracker.status)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data de Instalação</p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {new Date(tracker.installationDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                <p className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {new Date(tracker.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Observações</p>
              <p className="text-sm">{tracker.notes || 'Nenhuma observação registrada.'}</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status do Dispositivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Última Transmissão</p>
                <p className="flex items-center">
                  <Signal className="h-4 w-4 mr-2 text-muted-foreground" />
                  {tracker.lastTransmissionDate 
                    ? new Date(tracker.lastTransmissionDate).toLocaleString('pt-BR')
                    : 'Nunca transmitiu'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nível de Bateria</p>
                <div className="flex items-center">
                  <Battery className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (tracker.batteryLevel || 0) > 70 
                          ? 'bg-green-600' 
                          : (tracker.batteryLevel || 0) > 30 
                            ? 'bg-yellow-400'
                            : 'bg-red-600'
                      }`}
                      style={{ width: `${tracker.batteryLevel || 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{tracker.batteryLevel || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant={tracker.status === 'blocked' ? 'outline' : 'destructive'} 
                    className="w-full"
                  >
                    {tracker.status === 'blocked' ? (
                      <>
                        <Signal className="h-4 w-4 mr-2" />
                        Desbloquear Rastreador
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Bloquear Rastreador
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {tracker.status === 'blocked' 
                        ? 'Desbloquear Rastreador' 
                        : 'Bloquear Rastreador'}
                    </DialogTitle>
                    <DialogDescription>
                      {tracker.status === 'blocked' 
                        ? 'Tem certeza que deseja desbloquear este rastreador? O veículo voltará a funcionar normalmente.'
                        : 'Tem certeza que deseja bloquear este rastreador? O veículo será impedido de ligar.'}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      variant={tracker.status === 'blocked' ? 'default' : 'destructive'} 
                      onClick={handleBlockToggle} 
                      disabled={isBlockLoading}
                    >
                      {isBlockLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {tracker.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Ver Localização
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackerDetail;
