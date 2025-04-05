
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Search, Plus, Filter, X } from 'lucide-react';

const ResellerClients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStatus, setFilteredStatus] = useState('all');
  
  // Mock clients data
  const clients = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 99999-8888',
      status: 'active',
      vehicles: 2,
      lastPayment: '2023-10-15',
    },
    {
      id: 2,
      name: 'Maria Oliveira',
      email: 'maria@example.com',
      phone: '(11) 97777-6666',
      status: 'inactive',
      vehicles: 1,
      lastPayment: '2023-09-20',
    },
    {
      id: 3,
      name: 'Carlos Santos',
      email: 'carlos@example.com',
      phone: '(11) 95555-4444',
      status: 'pending',
      vehicles: 3,
      lastPayment: '2023-10-05',
    },
    {
      id: 4,
      name: 'Ana Pereira',
      email: 'ana@example.com',
      phone: '(11) 93333-2222',
      status: 'active',
      vehicles: 1,
      lastPayment: '2023-10-18',
    },
  ];

  // Filter clients based on search term and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    
    const matchesStatus = filteredStatus === 'all' || client.status === filteredStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilteredStatus(value);
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilteredStatus('all');
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'inactive':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  return (
    <TabsContent value="clients" className="mt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Clientes da Revenda</CardTitle>
          <CardDescription>
            Gerencie os clientes cadastrados na sua revenda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <div className="relative mb-4 sm:mb-0 w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex space-x-2">
              <Tabs defaultValue={filteredStatus} value={filteredStatus} onValueChange={handleFilterChange} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="inactive">Inativos</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {(searchTerm || filteredStatus !== 'all') && (
                <Button variant="outline" size="icon" onClick={clearFilters} className="flex-shrink-0">
                  <X size={18} />
                </Button>
              )}
              
              <Button className="flex-shrink-0">
                <Plus size={18} className="mr-2" />
                Novo Cliente
              </Button>
            </div>
          </div>
          
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar seus filtros ou adicione um novo cliente.
              </p>
              <div className="mt-6">
                <Button>
                  <Plus size={18} className="mr-2" />
                  Adicionar cliente
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Nome</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Contato</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Veículos</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Último Pagamento</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium">{client.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div>{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={getStatusBadgeClass(client.status)}>
                          {client.status === 'active' && 'Ativo'}
                          {client.status === 'inactive' && 'Inativo'}
                          {client.status === 'pending' && 'Pendente'}
                        </span>
                      </td>
                      <td className="py-4 px-4">{client.vehicles}</td>
                      <td className="py-4 px-4">{new Date(client.lastPayment).toLocaleDateString('pt-BR')}</td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ResellerClients;
