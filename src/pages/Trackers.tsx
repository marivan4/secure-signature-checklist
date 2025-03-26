
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, PlusCircle, MapPin, Router, Calendar, Signal, Battery, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Trackers: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample trackers data
  const trackers = [
    { id: 1, imei: '123456789012345', model: 'GT06N', client: 'João Silva', vehicle: 'Honda Civic', licensePlate: 'ABC-1234', status: 'active', lastUpdate: '10 min atrás' },
    { id: 2, imei: '987654321098765', model: 'GT02D', client: 'Maria Oliveira', vehicle: 'Toyota Corolla', licensePlate: 'DEF-5678', status: 'inactive', lastUpdate: '2 dias atrás' },
    { id: 3, imei: '456789012345678', model: 'TK103B', client: 'Pedro Santos', vehicle: 'Volkswagen Gol', licensePlate: 'GHI-9012', status: 'active', lastUpdate: '30 min atrás' },
    { id: 4, imei: '789012345678901', model: 'GT06N', client: 'Ana Costa', vehicle: 'Fiat Uno', licensePlate: 'JKL-3456', status: 'maintenance', lastUpdate: '5 dias atrás' },
    { id: 5, imei: '654321098765432', model: 'TK103B', client: 'Carlos Pereira', vehicle: 'Chevrolet Onix', licensePlate: 'MNO-7890', status: 'active', lastUpdate: '1 hora atrás' },
  ];
  
  // Filter trackers based on search query
  const filteredTrackers = trackers.filter(tracker => 
    tracker.imei.includes(searchQuery) ||
    tracker.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tracker.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tracker.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tracker.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Inativo</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manutenção</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rastreadores</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento de todos os rastreadores instalados
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar rastreadores..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={() => navigate('/trackers/new')} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Rastreador
          </Button>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Rastreadores</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">159</div>
            <p className="text-xs text-muted-foreground mt-1">
              +20 novos em 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Signal className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground mt-1">
              83% do total
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <Battery className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground mt-1">
              17% do total
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Trackers Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Lista de Rastreadores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IMEI</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrackers.map((tracker) => (
                <TableRow key={tracker.id}>
                  <TableCell className="font-medium">{tracker.imei}</TableCell>
                  <TableCell>{tracker.model}</TableCell>
                  <TableCell>{tracker.client}</TableCell>
                  <TableCell>{tracker.vehicle}</TableCell>
                  <TableCell>{tracker.licensePlate}</TableCell>
                  <TableCell>{getStatusBadge(tracker.status)}</TableCell>
                  <TableCell>{tracker.lastUpdate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/trackers/${tracker.id}`)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trackers;
