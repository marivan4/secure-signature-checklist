
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Link as LinkIcon, Copy, Check, Plus, Trash, Edit, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const SchedulingSettings: React.FC = () => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(
    'Olá! Agende sua instalação de rastreador através do nosso sistema de auto agendamento. É rápido e fácil!'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      name: 'João Silva',
      phone: '(11) 98765-4321',
      vehicle: 'Toyota Corolla',
      licensePlate: 'ABC-1234',
      date: new Date(2025, 3, 10).toISOString(),
      time: '10:00',
      location: 'Sede - São Paulo',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Maria Oliveira',
      phone: '(21) 99876-5432',
      vehicle: 'Honda Civic',
      licensePlate: 'DEF-5678',
      date: new Date(2025, 3, 11).toISOString(),
      time: '14:00',
      location: 'Filial - Rio de Janeiro',
      status: 'confirmed'
    },
    {
      id: 3,
      name: 'Carlos Santos',
      phone: '(31) 97654-3210',
      vehicle: 'Ford Ka',
      licensePlate: 'GHI-9012',
      date: new Date(2025, 3, 5).toISOString(),
      time: '09:00',
      location: 'Filial - Belo Horizonte',
      status: 'completed'
    }
  ]);
  
  // Form states for new appointment
  const [newAppointment, setNewAppointment] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    licensePlate: '',
    date: '',
    time: '',
    location: '',
    note: ''
  });
  
  const selfSchedulingLink = `${window.location.origin}/schedule?company=${user?.id || 'default'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(selfSchedulingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copiado para a área de transferência");
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Configurações de auto agendamento salvas com sucesso");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateWhatsAppLink = () => {
    const encodedMessage = encodeURIComponent(`${message}\n\n${selfSchedulingLink}`);
    return `https://wa.me/?text=${encodedMessage}`;
  };
  
  const handleNewAppointmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddAppointment = () => {
    const { name, phone, vehicle, licensePlate, date, time, location } = newAppointment;
    
    if (!name || !phone || !vehicle || !licensePlate || !date || !time || !location) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Add the new appointment to the list
    const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
    setAppointments([
      ...appointments,
      {
        id: newId,
        name,
        phone,
        vehicle,
        licensePlate,
        date: new Date(date).toISOString(),
        time,
        location,
        status: 'pending'
      }
    ]);
    
    // Reset the form and close the dialog
    setNewAppointment({
      name: '',
      phone: '',
      email: '',
      vehicle: '',
      licensePlate: '',
      date: '',
      time: '',
      location: '',
      note: ''
    });
    setShowNewAppointmentDialog(false);
    
    toast.success('Agendamento criado com sucesso!');
  };
  
  const handleUpdateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
    
    toast.success(`Status do agendamento atualizado para ${
      status === 'pending' ? 'Pendente' : 
      status === 'confirmed' ? 'Confirmado' : 
      status === 'completed' ? 'Concluído' : 
      'Cancelado'
    }`);
  };
  
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pendente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Confirmado</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelado</Badge>;
    }
  };

  return (
    <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Configurações de Agendamento</h1>
      
      <Tabs defaultValue="settings">
        <TabsList className="mb-4">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                Auto Agendamento
              </CardTitle>
              <CardDescription>
                Configure o link de auto agendamento para seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="self-scheduling">Habilitar Auto Agendamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que clientes agendem instalações diretamente pelo link
                  </p>
                </div>
                <Switch 
                  id="self-scheduling" 
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Link de Auto Agendamento</Label>
                <div className="flex gap-2">
                  <Input value={selfSchedulingLink} readOnly className="flex-1" />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyLink}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Compartilhe este link com seus clientes para que eles possam agendar instalações
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduling-message">Mensagem de Convite</Label>
                <Textarea 
                  id="scheduling-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite a mensagem que será enviada junto com o link..."
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Compartilhar via WhatsApp
                </Button>
              </a>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Agendamentos
              </CardTitle>
              <CardDescription>
                Gerencie os agendamentos de instalação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={() => setShowNewAppointmentDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.name}</div>
                            <div className="text-sm text-muted-foreground">{appointment.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{appointment.vehicle}</div>
                            <div className="text-sm text-muted-foreground">{appointment.licensePlate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ptBR })}</div>
                            <div className="text-sm text-muted-foreground">{appointment.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.location}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <div className="relative group">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 z-50 w-48">
                                <div className="text-xs font-medium mb-1.5 text-muted-foreground">Alterar status</div>
                                <div className="space-y-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full justify-start text-yellow-600"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, 'pending')}
                                  >
                                    Pendente
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full justify-start text-blue-600"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                                  >
                                    Confirmado
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full justify-start text-green-600"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                                  >
                                    Concluído
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full justify-start text-red-600"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                                  >
                                    Cancelado
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {appointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Nenhum agendamento encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              Crie um novo agendamento de instalação para um cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cliente*</Label>
                <Input
                  id="name"
                  name="name"
                  value={newAppointment.name}
                  onChange={handleNewAppointmentChange}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone*</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newAppointment.phone}
                  onChange={handleNewAppointmentChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newAppointment.email}
                onChange={handleNewAppointmentChange}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Veículo*</Label>
                <Input
                  id="vehicle"
                  name="vehicle"
                  value={newAppointment.vehicle}
                  onChange={handleNewAppointmentChange}
                  placeholder="Marca/Modelo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Placa*</Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={newAppointment.licensePlate}
                  onChange={handleNewAppointmentChange}
                  placeholder="ABC-1234"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data*</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={handleNewAppointmentChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário*</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={handleNewAppointmentChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Local*</Label>
              <Input
                id="location"
                name="location"
                value={newAppointment.location}
                onChange={handleNewAppointmentChange}
                placeholder="Endereço completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Observações</Label>
              <Textarea
                id="note"
                name="note"
                value={newAppointment.note}
                onChange={handleNewAppointmentChange}
                placeholder="Informações adicionais"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAppointment}>
              Salvar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulingSettings;
