
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChecklistTable from '@/components/Checklist/ChecklistTable';
import { ClipboardList, FileCheck, Clock, Search, PlusCircle, Users, MapPin, Car, DollarSign, Home, Shield, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Input } from '@/components/ui/input';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Sample data for the payment status chart
  const paymentStatusData = [
    { name: 'Em atraso (30%)', value: 30, color: '#FF6B6B' },
    { name: 'Pagamento agendado (30%)', value: 30, color: '#4ECDC4' },
    { name: 'Em aberto (25%)', value: 25, color: '#FFD166' },
    { name: 'Outros (15%)', value: 15, color: '#6A0572' }
  ];

  // Sample statistics data
  const statistics = [
    { title: 'Contratos Cadastrados', value: 485, recent: '68 cadastros novos (últimos 30 dias)' },
    { title: 'Assinaturas', value: 56, recent: '22 cadastros novos (últimos 30 dias)' },
    { title: 'Pagamentos', value: 45, recent: '22 cadastros novos (últimos 30 dias)' },
    { title: 'Cooperativas', value: 39, recent: '22 cadastros novos (últimos 30 dias)' },
    { title: 'Clientes', value: 120, recent: '10 cadastros novos (últimos 30 dias)' },
    { title: 'Veículos', value: 240, recent: '15 cadastros novos (últimos 30 dias)' },
    { title: 'Rastreadores', value: 159, recent: '20 cadastros novos (últimos 30 dias)' },
    { title: 'Benefícios Contratados', value: 215, recent: '34 cadastros novos (últimos 30 dias)' }
  ];
  
  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'admin' 
              ? 'Gerenciamento completo do sistema' 
              : 'Visão geral do sistema'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              className="pl-9 w-full sm:w-[300px]"
            />
          </div>
          
          {user?.role === 'admin' && (
            <Button onClick={() => navigate('/checklist/new')} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo Contrato
            </Button>
          )}
        </div>
      </div>
      
      {/* Financial Summary Card */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold">R$103.330,23</CardTitle>
          <CardDescription>Próximo recebimento: 07/02/2023</CardDescription>
        </CardHeader>
      </Card>
      
      {/* Statistics Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statistics.slice(0, 4).map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">•••</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.recent}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Side - Empty for now or can add content */}
        <div></div>
        
        {/* Right Side - Payment Status Chart */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status dos Pagamentos</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">•••</div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Statistics Cards - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statistics.slice(4).map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">•••</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.recent}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="all">Todos Contratos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ChecklistTable />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <ChecklistTable filterStatus="pending" />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <ChecklistTable filterStatus="completed" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
