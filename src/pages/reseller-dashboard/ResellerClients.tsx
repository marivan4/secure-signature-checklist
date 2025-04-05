import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for reseller clients
const mockClients = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    phone: '(11) 98765-4321',
    cpfCnpj: '123.456.789-00',
    city: 'São Paulo',
    state: 'SP',
    status: 'active',
    createdAt: '2023-05-10T10:30:00Z'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@exemplo.com',
    phone: '(11) 97654-3210',
    cpfCnpj: '987.654.321-00',
    city: 'Campinas',
    state: 'SP',
    status: 'active',
    createdAt: '2023-06-15T14:20:00Z'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@exemplo.com',
    phone: '(11) 95432-1098',
    cpfCnpj: '456.789.123-00',
    city: 'Guarulhos',
    state: 'SP',
    status: 'inactive',
    createdAt: '2023-07-20T09:15:00Z'
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@exemplo.com',
    phone: '(11) 94321-0987',
    cpfCnpj: '789.123.456-00',
    city: 'Santo André',
    state: 'SP',
    status: 'pending',
    createdAt: '2023-08-05T16:45:00Z'
  }
];

const ResellerClients: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const deleteClient = (id: number) => {
    // In a real application, this would call an API to delete the client
    toast.success(`Cliente ${id} excluído com sucesso!`);
  };
  
  // Format date to Brazilian format (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inativo</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  // Filter clients by status and search term
  const filteredClients = mockClients
    .filter(client => filter === 'all' || client.status === filter)
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cpfCnpj.includes(searchTerm)
    );
  
  return (
    <TabsContent value="clients" className="mt-0">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Gerenciamento de Clientes</CardTitle>
            <CardDescription>
              Gerencie os clientes da sua revenda
            </CardDescription>
          </div>
          
          <Button asChild>
            <Link to="/reseller-dashboard/clients/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Link>
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                onClick={() => setFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button 
                variant={filter === 'active' ? 'default' : 'outline'} 
                onClick={() => setFilter('active')}
                size="sm"
              >
                Ativos
              </Button>
              <Button 
                variant={filter === 'pending' ? 'default' : 'outline'} 
                onClick={() => setFilter('pending')}
                size="sm"
              >
                Pendentes
              </Button>
              <Button 
                variant={filter === 'inactive' ? 'default' : 'outline'} 
                onClick={() => setFilter('inactive')}
                size="sm"
              >
                Inativos
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.cpfCnpj}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/reseller-dashboard/clients/${client.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/reseller-dashboard/clients/${client.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => deleteClient(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhum cliente encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredClients.length} de {mockClients.length} clientes
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default ResellerClients;
