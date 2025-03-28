
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Car, Clock, FileCheck, AlertTriangle, CheckCircle, Download, Eye } from 'lucide-react';

const Insurance: React.FC = () => {
  // Sample insurance plans
  const insurancePlans = [
    {
      id: 1,
      name: 'Plano Básico',
      description: 'Cobertura básica para roubo e furto',
      coverage: 'R$ 15.000,00',
      monthlyCost: 49.90,
      benefits: ['Cobertura para roubo', 'Cobertura para furto', 'Assistência 24h'],
      popular: false
    },
    {
      id: 2,
      name: 'Plano Completo',
      description: 'Cobertura completa para diversos sinistros',
      coverage: 'R$ 30.000,00',
      monthlyCost: 89.90,
      benefits: ['Cobertura para roubo', 'Cobertura para furto', 'Colisão', 'Incêndio', 'Assistência 24h', 'Carro reserva'],
      popular: true
    },
    {
      id: 3,
      name: 'Plano Premium',
      description: 'Cobertura total com benefícios exclusivos',
      coverage: 'R$ 50.000,00',
      monthlyCost: 129.90,
      benefits: ['Cobertura para roubo', 'Cobertura para furto', 'Colisão', 'Incêndio', 'Danos a terceiros', 'Assistência 24h', 'Carro reserva', 'Guincho ilimitado'],
      popular: false
    }
  ];
  
  // Sample client insurance policies - ensure consistent immutable data structure 
  const [clientPolicies] = useState([
    {
      id: 101,
      client: 'João Silva',
      vehicle: 'Honda Civic',
      licensePlate: 'ABC-1234',
      plan: 'Plano Completo',
      startDate: '10/01/2023',
      endDate: '10/01/2024',
      status: 'active',
      monthlyCost: 89.90
    },
    {
      id: 102,
      client: 'Maria Oliveira',
      vehicle: 'Toyota Corolla',
      licensePlate: 'DEF-5678',
      plan: 'Plano Premium',
      startDate: '15/02/2023',
      endDate: '15/02/2024',
      status: 'active',
      monthlyCost: 129.90
    },
    {
      id: 103,
      client: 'Pedro Santos',
      vehicle: 'Volkswagen Gol',
      licensePlate: 'GHI-9012',
      plan: 'Plano Básico',
      startDate: '20/03/2023',
      endDate: '20/03/2024',
      status: 'pending',
      monthlyCost: 49.90
    }
  ]);
  
  // Sample claims - ensure consistent immutable data structure
  const [claims] = useState([
    {
      id: 201,
      client: 'João Silva',
      vehicle: 'Honda Civic',
      licensePlate: 'ABC-1234',
      date: '05/05/2023',
      type: 'Roubo',
      status: 'approved',
      amount: 'R$ 20.000,00'
    },
    {
      id: 202,
      client: 'Maria Oliveira',
      vehicle: 'Toyota Corolla',
      licensePlate: 'DEF-5678',
      date: '12/06/2023',
      type: 'Colisão',
      status: 'pending',
      amount: 'R$ 5.000,00'
    }
  ]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Negado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seguros</h1>
          <p className="text-muted-foreground mt-1">
            Proteção e tranquilidade para o seu veículo
          </p>
        </div>
        
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Contratar Seguro
        </Button>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguros Ativos</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5 novos em 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinistros Abertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 aprovados, 5 pendentes
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Coberto</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.2M</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total segurado atual
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Insurance Plans */}
      <h2 className="text-2xl font-bold tracking-tight mb-4">Planos de Seguro</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {insurancePlans.map((plan) => (
          <Card key={plan.id} className={`h-full flex flex-col ${plan.popular ? 'border-primary' : ''}`}>
            <CardHeader>
              {plan.popular && (
                <Badge variant="default" className="w-fit mb-2 bg-primary">Mais Popular</Badge>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">
                R$ {plan.monthlyCost.toFixed(2).replace('.', ',')}
                <span className="text-sm text-muted-foreground font-normal">/mês</span>
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium">Cobertura até:</span> {plan.coverage}
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Benefícios:</h4>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Contratar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Client Policies */}
      <h2 className="text-2xl font-bold tracking-tight mb-4">Apólices Ativas</h2>
      <Card className="shadow-sm mb-8">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mensalidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.client}</TableCell>
                  <TableCell>{policy.vehicle}</TableCell>
                  <TableCell>{policy.licensePlate}</TableCell>
                  <TableCell>{policy.plan}</TableCell>
                  <TableCell>{policy.startDate} - {policy.endDate}</TableCell>
                  <TableCell>{getStatusBadge(policy.status)}</TableCell>
                  <TableCell>R$ {policy.monthlyCost.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Claims */}
      <h2 className="text-2xl font-bold tracking-tight mb-4">Sinistros</h2>
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.client}</TableCell>
                  <TableCell>{claim.vehicle}</TableCell>
                  <TableCell>{claim.licensePlate}</TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  <TableCell>{claim.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
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

export default Insurance;
