import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash, 
  Eye, 
  Car, 
  CreditCard,
  Download, 
  FileText, 
  Mail, 
  Phone, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'João da Silva',
      email: 'joao@example.com',
      phone: '(11) 99999-9999',
      status: 'active',
      createdAt: '2023-01-01',
      vehicles: 3,
      invoices: 5,
      lastInvoiceStatus: 'paid',
    },
    {
      id: 2,
      name: 'Maria Oliveira',
      email: 'maria@example.com',
      phone: '(21) 88888-8888',
      status: 'inactive',
      createdAt: '2023-02-15',
      vehicles: 1,
      invoices: 2,
      lastInvoiceStatus: 'pending',
    },
    {
      id: 3,
      name: 'Carlos Pereira',
      email: 'carlos@example.com',
      phone: '(31) 77777-7777',
      status: 'active',
      createdAt: '2023-03-20',
      vehicles: 2,
      invoices: 3,
      lastInvoiceStatus: 'overdue',
    },
  ]);
  const [search, setSearch] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch clients from API here
    // For now, using mock data
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClient = (id: number) => {
    setSelectedClientId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteClient = () => {
    if (selectedClientId) {
      // Delete client from API here
      // For now, just remove from local state
      setClients(clients.filter(client => client.id !== selectedClientId));
      setOpenDeleteDialog(false);
      setSelectedClientId(null);
      toast.success('Cliente excluído com sucesso!');
    }
  };

  // Render client actions dropdown
  const renderClientActions = (client: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/clients/edit/${client.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar cliente
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/vehicles`)}>
          <Car className="mr-2 h-4 w-4" />
          Ver veículos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/charge`)}>
          <CreditCard className="mr-2 h-4 w-4" />
          Criar cobrança avulsa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/invoices?clientId=${client.id}`)}>
          <FileText className="mr-2 h-4 w-4" />
          Ver faturas
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteClient(client.id)} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Excluir cliente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes e visualize informações detalhadas.
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <Input
            type="search"
            placeholder="Buscar clientes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="md:w-64 lg:w-80"
          />
          {user?.role === 'admin' || user?.role === 'manager' ? (
            <Button asChild>
              <Link to="/clients/new" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Adicionar Cliente</span>
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Visualize e gerencie seus clientes cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    {client.status === 'active' ? (
                      <Badge variant="outline">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderClientActions(client)}
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Cliente</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este cliente? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteClient}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
