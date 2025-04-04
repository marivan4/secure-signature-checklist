
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Smartphone, PlusCircle, RefreshCw, AlertCircle, Battery, Signal } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface SimCard {
  id: number;
  number: string;
  iccid: string;
  provider: string;
  dataUsage: number;
  status: 'active' | 'inactive' | 'suspended';
  lastCheck: string;
  vehicle?: string;
  client?: string;
}

const mockSimCards: SimCard[] = [
  {
    id: 1,
    number: '11987654321',
    iccid: '89550471501234567890',
    provider: 'Vivo',
    dataUsage: 42.5,
    status: 'active',
    lastCheck: '2025-04-01T14:30:00Z',
    vehicle: 'Toyota Corolla - ABC1234',
    client: 'João Silva'
  },
  {
    id: 2,
    number: '11912345678',
    iccid: '89550471898765432109',
    provider: 'Claro',
    dataUsage: 78.2,
    status: 'active',
    lastCheck: '2025-04-02T10:15:00Z',
    vehicle: 'Honda Civic - DEF5678',
    client: 'Maria Oliveira'
  },
  {
    id: 3,
    number: '11955556666',
    iccid: '89550471567890123456',
    provider: 'TIM',
    dataUsage: 12.8,
    status: 'inactive',
    lastCheck: '2025-03-28T09:45:00Z'
  },
  {
    id: 4,
    number: '11944445555',
    iccid: '89550471654321098765',
    provider: 'Oi',
    dataUsage: 95.7,
    status: 'suspended',
    lastCheck: '2025-04-03T16:20:00Z',
    vehicle: 'Ford Ka - GHI9012',
    client: 'Carlos Santos'
  }
];

const SimCardManagement: React.FC = () => {
  const [simCards, setSimCards] = useState<SimCard[]>(mockSimCards);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSimCard, setNewSimCard] = useState({
    number: '',
    iccid: '',
    provider: 'Vivo'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSimCard = () => {
    if (!newSimCard.number || !newSimCard.iccid || !newSimCard.provider) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newId = Math.max(...simCards.map(s => s.id), 0) + 1;
    const simCardToAdd: SimCard = {
      id: newId,
      number: newSimCard.number,
      iccid: newSimCard.iccid,
      provider: newSimCard.provider,
      dataUsage: 0,
      status: 'inactive',
      lastCheck: new Date().toISOString()
    };

    setSimCards([...simCards, simCardToAdd]);
    setNewSimCard({ number: '', iccid: '', provider: 'Vivo' });
    setIsAddDialogOpen(false);
    toast.success("SIM Card adicionado com sucesso");
  };

  const refreshSimCardStatus = async (id: number) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the last check timestamp
      setSimCards(
        simCards.map(sim => 
          sim.id === id 
            ? { ...sim, lastCheck: new Date().toISOString() } 
            : sim
        )
      );
      
      toast.success("Status do SIM Card atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar status do SIM Card");
      console.error("Erro ao atualizar status do SIM Card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSimCardStatus = (id: number) => {
    setSimCards(
      simCards.map(sim => {
        if (sim.id !== id) return sim;
        
        let newStatus: 'active' | 'inactive' | 'suspended';
        switch (sim.status) {
          case 'active':
            newStatus = 'inactive';
            break;
          case 'inactive':
            newStatus = 'active';
            break;
          case 'suspended':
            newStatus = 'active';
            break;
          default:
            newStatus = 'active';
        }
        
        return { ...sim, status: newStatus };
      })
    );
    
    const simCard = simCards.find(sim => sim.id === id);
    if (simCard) {
      let statusText = '';
      switch (simCard.status) {
        case 'active':
          statusText = 'inativo';
          break;
        case 'inactive':
        case 'suspended':
          statusText = 'ativo';
          break;
      }
      toast.success(`Status do SIM Card alterado para ${statusText}`);
    }
  };

  const getStatusColor = (status: SimCard['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDataUsage = (usage: number) => {
    return `${usage.toFixed(1)} MB`;
  };

  const formatLastCheck = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Smartphone className="mr-2 h-5 w-5 text-primary" />
          Gestão de SIM Cards
        </CardTitle>
        <CardDescription>
          Gerencie os chips móveis utilizados pelos rastreadores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar SIM Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo SIM Card</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo chip para adicioná-lo ao sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input 
                    id="number" 
                    value={newSimCard.number}
                    onChange={(e) => setNewSimCard({...newSimCard, number: e.target.value})}
                    placeholder="Ex: 11987654321"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iccid">ICCID</Label>
                  <Input 
                    id="iccid" 
                    value={newSimCard.iccid}
                    onChange={(e) => setNewSimCard({...newSimCard, iccid: e.target.value})}
                    placeholder="Ex: 89550471501234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Operadora</Label>
                  <Select 
                    value={newSimCard.provider}
                    onValueChange={(value) => setNewSimCard({...newSimCard, provider: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a operadora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vivo">Vivo</SelectItem>
                      <SelectItem value="Claro">Claro</SelectItem>
                      <SelectItem value="TIM">TIM</SelectItem>
                      <SelectItem value="Oi">Oi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddSimCard}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>ICCID</TableHead>
                <TableHead>Operadora</TableHead>
                <TableHead>Uso de Dados</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Verificação</TableHead>
                <TableHead>Veículo/Cliente</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simCards.map((sim) => (
                <TableRow key={sim.id}>
                  <TableCell className="font-medium">{sim.number}</TableCell>
                  <TableCell>{sim.iccid}</TableCell>
                  <TableCell>{sim.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
                        title={`${Math.min(sim.dataUsage, 100)}% utilizado`}
                      >
                        <div 
                          className={`h-full ${sim.dataUsage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(sim.dataUsage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs">{formatDataUsage(sim.dataUsage)}</span>
                      {sim.dataUsage > 80 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => toggleSimCardStatus(sim.id)}
                    >
                      <div className={`h-2 w-2 rounded-full mr-1.5 ${getStatusColor(sim.status)}`} />
                      {sim.status === 'active' ? 'Ativo' : sim.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatLastCheck(sim.lastCheck)}</TableCell>
                  <TableCell>
                    {sim.vehicle && sim.client ? (
                      <div className="text-sm">
                        <div>{sim.vehicle}</div>
                        <div className="text-muted-foreground">{sim.client}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => refreshSimCardStatus(sim.id)}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimCardManagement;
