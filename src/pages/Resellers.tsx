
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, DollarSign, Calendar, Store, ExternalLink, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for resellers
const mockResellers = [
  {
    id: 1,
    name: 'Rastreadores São Paulo',
    location: 'São Paulo, SP',
    clientsCount: 125,
    monthlyRevenue: 15000,
    since: '2019-05-10',
    status: 'active',
    logo: 'https://via.placeholder.com/200'
  },
  {
    id: 2,
    name: 'Segurança Veicular BH',
    location: 'Belo Horizonte, MG',
    clientsCount: 98,
    monthlyRevenue: 12000,
    since: '2020-03-15',
    status: 'active',
    logo: 'https://via.placeholder.com/200'
  },
  {
    id: 3,
    name: 'Auto Track Rio',
    location: 'Rio de Janeiro, RJ',
    clientsCount: 87,
    monthlyRevenue: 10000,
    since: '2020-11-22',
    status: 'pending',
    logo: 'https://via.placeholder.com/200'
  },
  {
    id: 4,
    name: 'Rastreio Norte',
    location: 'Manaus, AM',
    clientsCount: 45,
    monthlyRevenue: 7500,
    since: '2021-08-05',
    status: 'active',
    logo: 'https://via.placeholder.com/200'
  },
  {
    id: 5,
    name: 'Sul Tracker',
    location: 'Porto Alegre, RS',
    clientsCount: 63,
    monthlyRevenue: 9000,
    since: '2021-04-30',
    status: 'inactive',
    logo: 'https://via.placeholder.com/200'
  }
];

const Resellers: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  
  const filteredResellers = filter === 'all' 
    ? mockResellers 
    : mockResellers.filter(reseller => reseller.status === filter);

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revendas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas revendas e parceiros comerciais
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <Button asChild>
            <Link to="/resellers/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Revenda
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>Todas</TabsTrigger>
          <TabsTrigger value="active" onClick={() => setFilter('active')}>Ativas</TabsTrigger>
          <TabsTrigger value="pending" onClick={() => setFilter('pending')}>Pendentes</TabsTrigger>
          <TabsTrigger value="inactive" onClick={() => setFilter('inactive')}>Inativas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResellers.map((reseller) => (
              <ResellerCard key={reseller.id} reseller={reseller} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResellers.map((reseller) => (
              <ResellerCard key={reseller.id} reseller={reseller} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResellers.map((reseller) => (
              <ResellerCard key={reseller.id} reseller={reseller} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResellers.map((reseller) => (
              <ResellerCard key={reseller.id} reseller={reseller} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResellerCardProps {
  reseller: {
    id: number;
    name: string;
    location: string;
    clientsCount: number;
    monthlyRevenue: number;
    since: string;
    status: string;
    logo: string;
  };
}

const ResellerCard: React.FC<ResellerCardProps> = ({ reseller }) => {
  const { user } = useAuth();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inativa</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  // Format date to Brazilian format (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video w-full relative bg-muted flex items-center justify-center">
        <img src={reseller.logo} alt={reseller.name} className="object-contain w-3/4 h-3/4" />
        <div className="absolute top-2 right-2">
          {getStatusBadge(reseller.status)}
        </div>
      </div>
      <CardHeader>
        <CardTitle>{reseller.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {reseller.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          <span>{reseller.clientsCount} clientes</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>R$ {reseller.monthlyRevenue.toFixed(2).replace('.', ',')} mensais</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Desde {formatDate(reseller.since)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {user?.role === 'admin' && (
          <Button variant="outline" asChild>
            <Link to={`/resellers/${reseller.id}/edit`}>
              Editar
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link to={`/resellers/${reseller.id}`}>
            Detalhes
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Resellers;
