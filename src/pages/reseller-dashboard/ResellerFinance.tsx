
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CreditCard, FileText, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ResellerFinance: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null);

  // Mock financial data
  const financialData = {
    balance: 12500.75,
    pendingPayments: 2350.00,
    pendingInvoices: 4,
    totalInvoicesMonth: 8500.00,
    comissionRate: 15, // percentage
  };

  // Mock invoices
  const invoices = [
    {
      id: 1,
      clientName: 'João Silva',
      amount: 350.00,
      date: '2023-10-15',
      status: 'paid',
      commission: 52.50,
    },
    {
      id: 2,
      clientName: 'Maria Oliveira',
      amount: 450.00,
      date: '2023-10-12',
      status: 'pending',
      commission: 67.50,
    },
    {
      id: 3,
      clientName: 'Carlos Santos',
      amount: 1200.00,
      date: '2023-10-08',
      status: 'paid',
      commission: 180.00,
    },
    {
      id: 4,
      clientName: 'Ana Pereira',
      amount: 350.00,
      date: '2023-10-05',
      status: 'paid',
      commission: 52.50,
    },
  ];

  const toggleInvoiceDetails = (invoiceId: number) => {
    if (expandedInvoice === invoiceId) {
      setExpandedInvoice(null);
    } else {
      setExpandedInvoice(invoiceId);
    }
  };

  return (
    <TabsContent value="finance" className="mt-0">
      <Card>
        <CardHeader>
          <CardTitle>Financeiro</CardTitle>
          <CardDescription>
            Gerencie comissões, faturas e pagamentos relacionados à sua revenda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={currentTab} value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="invoices">Faturas</TabsTrigger>
              <TabsTrigger value="commissions">Comissões</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Saldo Total
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {financialData.balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Saldo atual da revenda
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pagamentos Pendentes
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {financialData.pendingPayments.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {financialData.pendingInvoices} faturas pendentes
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taxa de Comissão
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {financialData.comissionRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Porcentagem sobre vendas
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="invoices">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <Input placeholder="Buscar faturas..." className="max-w-xs" />
                  <div className="flex flex-wrap gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="paid">Pagas</SelectItem>
                        <SelectItem value="pending">Pendentes</SelectItem>
                        <SelectItem value="overdue">Vencidas</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <div className="bg-muted/50 p-4 grid grid-cols-5 font-medium">
                    <div className="col-span-2">Cliente</div>
                    <div>Valor</div>
                    <div>Data</div>
                    <div>Status</div>
                  </div>
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="border-t">
                      <div 
                        className="p-4 grid grid-cols-5 cursor-pointer hover:bg-muted/30"
                        onClick={() => toggleInvoiceDetails(invoice.id)}
                      >
                        <div className="col-span-2 font-medium flex items-center">
                          {expandedInvoice === invoice.id ? 
                            <ChevronUp className="h-4 w-4 mr-2" /> : 
                            <ChevronDown className="h-4 w-4 mr-2" />
                          }
                          {invoice.clientName}
                        </div>
                        <div>R$ {invoice.amount.toFixed(2)}</div>
                        <div>{new Date(invoice.date).toLocaleDateString('pt-BR')}</div>
                        <div>
                          <span className={
                            invoice.status === 'paid' ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs' : 
                            invoice.status === 'pending' ? 'text-amber-600 bg-amber-100 px-2 py-1 rounded-full text-xs' :
                            'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs'
                          }>
                            {invoice.status === 'paid' ? 'Paga' : 
                             invoice.status === 'pending' ? 'Pendente' : 'Vencida'}
                          </span>
                        </div>
                      </div>
                      
                      {expandedInvoice === invoice.id && (
                        <div className="p-4 bg-muted/20 border-t">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Detalhes da Fatura</p>
                              <p className="text-sm mt-2">ID: #{invoice.id}</p>
                              <p className="text-sm">Comissão: R$ {invoice.commission.toFixed(2)} ({financialData.comissionRate}%)</p>
                            </div>
                            <div className="text-right">
                              <Button variant="outline" size="sm" className="mx-1">
                                <FileText className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </Button>
                              <Button size="sm" className="mx-1">
                                <Download className="h-4 w-4 mr-2" />
                                Baixar PDF
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="commissions">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comissões Mensais</CardTitle>
                    <CardDescription>
                      Resumo das suas comissões nos últimos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">Gráfico de comissões por mês</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Comissões</CardTitle>
                    <CardDescription>
                      Detalhes das suas comissões recebidas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="bg-muted/50 p-4 grid grid-cols-4 font-medium">
                        <div>Mês</div>
                        <div>Vendas Totais</div>
                        <div>Comissão</div>
                        <div>Status</div>
                      </div>
                      
                      <div className="border-t p-4 grid grid-cols-4">
                        <div>Outubro 2023</div>
                        <div>R$ 8.500,00</div>
                        <div>R$ 1.275,00</div>
                        <div>
                          <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                            Pago
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t p-4 grid grid-cols-4">
                        <div>Setembro 2023</div>
                        <div>R$ 7.800,00</div>
                        <div>R$ 1.170,00</div>
                        <div>
                          <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                            Pago
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t p-4 grid grid-cols-4">
                        <div>Agosto 2023</div>
                        <div>R$ 9.200,00</div>
                        <div>R$ 1.380,00</div>
                        <div>
                          <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                            Pago
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ResellerFinance;
