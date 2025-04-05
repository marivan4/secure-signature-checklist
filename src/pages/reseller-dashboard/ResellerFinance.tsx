
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

// Mock data for sales
const salesData = [
  { month: 'Jan', value: 3200 },
  { month: 'Fev', value: 4500 },
  { month: 'Mar', value: 5200 },
  { month: 'Abr', value: 4800 },
  { month: 'Mai', value: 6000 },
  { month: 'Jun', value: 5500 },
];

// Mock data for summary
const summaryData = {
  monthlyRevenue: 5500,
  changePercentage: 12.5,
  activeClients: 32,
  pendingInvoices: 7,
  pendingAmount: 2300,
};

const ResellerFinance: React.FC = () => {
  return (
    <TabsContent value="finance" className="mt-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {summaryData.monthlyRevenue.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {summaryData.changePercentage > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">{summaryData.changePercentage}%</span> do mês passado
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">{Math.abs(summaryData.changePercentage)}%</span> do mês passado
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.activeClients}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              clientes ativos no sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturas Pendentes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.pendingInvoices}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              totalizando R$ {summaryData.pendingAmount.toFixed(2).replace('.', ',')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(summaryData.monthlyRevenue / summaryData.activeClients).toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              por cliente ativo
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Receita nos Últimos 6 Meses</CardTitle>
          <CardDescription>
            Acompanhe a evolução da sua receita mensal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`R$ ${value}`, 'Receita']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ResellerFinance;
