
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Smartphone, PlusCircle, RefreshCw, AlertCircle, Battery, Signal, Plus, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

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

interface Provider {
  id: number;
  name: string;
  description: string;
  apiKey?: string;
  apiUrl?: string;
  isDefault: boolean;
}

const defaultProviders: Provider[] = [
  { id: 1, name: 'Vivo', description: 'Vivo Empresas', isDefault: true },
  { id: 2, name: 'Claro', description: 'Claro Empresas', isDefault: true },
  { id: 3, name: 'TIM', description: 'TIM Empresas', isDefault: true },
  { id: 4, name: 'Oi', description: 'Oi Empresas', isDefault: true },
  { id: 5, name: 'Linkfields', description: 'Linkfields IOT', isDefault: true },
  { id: 6, name: 'Arqia', description: 'Arqia IOT', isDefault: true },
  { id: 7, name: 'Hinova', description: 'Hinova Telecom', isDefault: true },
  { id: 8, name: 'Transmeet', description: 'Transmeet IOT', isDefault: true }
];

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
  },
  {
    id: 5,
    number: '11933334444',
    iccid: '89550471123456789012',
    provider: 'Linkfields',
    dataUsage: 35.2,
    status: 'active',
    lastCheck: '2025-04-02T11:30:00Z',
    vehicle: 'Chevrolet Onix - JKL3456',
    client: 'Ana Pereira'
  },
  {
    id: 6,
    number: '11922223333',
    iccid: '89550471987654321098',
    provider: 'Arqia',
    dataUsage: 22.8,
    status: 'active',
    lastCheck: '2025-04-03T09:15:00Z',
    vehicle: 'VW Gol - MNO7890',
    client: 'Roberto Almeida'
  }
];

const SimCardManagement: React.FC = () => {
  const [simCards, setSimCards] = useState<SimCard[]>(mockSimCards);
  const [providers, setProviders] = useState<Provider[]>(defaultProviders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [isEditProviderDialogOpen, setIsEditProviderDialogOpen] = useState(false);
  const [newSimCard, setNewSimCard] = useState({
    number: '',
    iccid: '',
    provider: 'Vivo'
  });
  const [newProvider, setNewProvider] = useState({
    name: '',
    description: '',
    apiKey: '',
    apiUrl: ''
  });
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
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

  const handleAddProvider = () => {
    if (!newProvider.name) {
      toast.error("O nome da operadora é obrigatório");
      return;
    }

    const newId = Math.max(...providers.map(p => p.id), 0) + 1;
    const providerToAdd: Provider = {
      id: newId,
      name: newProvider.name,
      description: newProvider.description,
      apiKey: newProvider.apiKey,
      apiUrl: newProvider.apiUrl,
      isDefault: false
    };

    setProviders([...providers, providerToAdd]);
    setNewProvider({
      name: '',
      description: '',
      apiKey: '',
      apiUrl: ''
    });
    setIsProviderDialogOpen(false);
    toast.success("Operadora adicionada com sucesso");
  };

  const handleEditProvider = () => {
    if (!selectedProvider || !selectedProvider.name) {
      toast.error("O nome da operadora é obrigatório");
      return;
    }

    setProviders(
      providers.map(provider => 
        provider.id === selectedProvider.id ? selectedProvider : provider
      )
    );
    
    setIsEditProviderDialogOpen(false);
    toast.success("Operadora atualizada com sucesso");
  };

  const handleDeleteProvider = (id: number) => {
    // Check if provider is being used by any SIM card
    const providerInUse = simCards.some(sim => {
      const provider = providers.find(p => p.id === id);
      return provider && sim.provider === provider.name;
    });

    if (providerInUse) {
      toast.error("Não é possível excluir uma operadora em uso por SIM Cards");
      return;
    }

    // Check if it's a default provider
    const isDefault = providers.find(p => p.id === id)?.isDefault;
    if (isDefault) {
      toast.error("Não é possível excluir operadoras padrão do sistema");
      return;
    }

    setProviders(providers.filter(provider => provider.id !== id));
    toast.success("Operadora excluída com sucesso");
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
        <Tabs defaultValue="simcards">
          <TabsList className="mb-4">
            <TabsTrigger value="simcards">SIM Cards</TabsTrigger>
            <TabsTrigger value="providers">Operadoras</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simcards">
            <div className="mb-4">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar SIM Card
              </Button>
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
          </TabsContent>

          <TabsContent value="providers">
            <div className="mb-4">
              <Button onClick={() => setIsProviderDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Operadora
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>API</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>{provider.description}</TableCell>
                      <TableCell>
                        {provider.isDefault ? (
                          <Badge variant="secondary">Padrão</Badge>
                        ) : (
                          <Badge variant="outline">Personalizada</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {provider.apiUrl ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Configurada
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                            Não Configurada
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedProvider(provider);
                              setIsEditProviderDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          {!provider.isDefault && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDeleteProvider(provider.id)}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog for adding a new SIM card */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.name}>
                        {provider.name}
                      </SelectItem>
                    ))}
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

        {/* Dialog for adding a new provider */}
        <Dialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Operadora</DialogTitle>
              <DialogDescription>
                Cadastre uma nova operadora para utilização nos SIM Cards.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="provider-name">Nome da Operadora*</Label>
                <Input 
                  id="provider-name" 
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                  placeholder="Ex: Operadora XYZ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-description">Descrição</Label>
                <Textarea 
                  id="provider-description" 
                  value={newProvider.description}
                  onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                  placeholder="Breve descrição da operadora"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-apikey">Chave de API (opcional)</Label>
                <Input 
                  id="provider-apikey" 
                  value={newProvider.apiKey}
                  onChange={(e) => setNewProvider({...newProvider, apiKey: e.target.value})}
                  placeholder="Chave de API para integração"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-apiurl">URL da API (opcional)</Label>
                <Input 
                  id="provider-apiurl" 
                  value={newProvider.apiUrl}
                  onChange={(e) => setNewProvider({...newProvider, apiUrl: e.target.value})}
                  placeholder="https://api.exemplo.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProviderDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddProvider}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for editing a provider */}
        <Dialog open={isEditProviderDialogOpen} onOpenChange={setIsEditProviderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Operadora</DialogTitle>
              <DialogDescription>
                Atualize as informações da operadora.
              </DialogDescription>
            </DialogHeader>
            {selectedProvider && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-provider-name">Nome da Operadora*</Label>
                  <Input 
                    id="edit-provider-name" 
                    value={selectedProvider.name}
                    onChange={(e) => setSelectedProvider({...selectedProvider, name: e.target.value})}
                    placeholder="Ex: Operadora XYZ"
                    disabled={selectedProvider.isDefault}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-provider-description">Descrição</Label>
                  <Textarea 
                    id="edit-provider-description" 
                    value={selectedProvider.description}
                    onChange={(e) => setSelectedProvider({...selectedProvider, description: e.target.value})}
                    placeholder="Breve descrição da operadora"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-provider-apikey">Chave de API (opcional)</Label>
                  <Input 
                    id="edit-provider-apikey" 
                    value={selectedProvider.apiKey || ''}
                    onChange={(e) => setSelectedProvider({...selectedProvider, apiKey: e.target.value})}
                    placeholder="Chave de API para integração"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-provider-apiurl">URL da API (opcional)</Label>
                  <Input 
                    id="edit-provider-apiurl" 
                    value={selectedProvider.apiUrl || ''}
                    onChange={(e) => setSelectedProvider({...selectedProvider, apiUrl: e.target.value})}
                    placeholder="https://api.exemplo.com"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProviderDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleEditProvider}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SimCardManagement;
