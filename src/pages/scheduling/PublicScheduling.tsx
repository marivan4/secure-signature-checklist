
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, Check, Clock, MapPin, Phone, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PublicScheduling: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const companyId = searchParams.get('company') || '';
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([
    'Sede - São Paulo', 'Filial - Rio de Janeiro', 'Filial - Belo Horizonte'
  ]);

  useEffect(() => {
    // In a real implementation, we would fetch company info and available slots
    if (companyId) {
      // Mock data - in real implementation this would be an API call
      setCompanyName('Track\'n\'Me Rastreadores');
    }
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !vehicle || !licensePlate || !date || !timeSlot || !location) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Agendamento realizado com sucesso! Em breve entraremos em contato para confirmar.');
      
      // In a real implementation, we would save the scheduling data to the database
      // and potentially send notifications to both customer and company
      
      // Reset form after successful submission
      setName('');
      setPhone('');
      setEmail('');
      setVehicle('');
      setLicensePlate('');
      setDate(undefined);
      setTimeSlot('');
      setLocation('');
      setNote('');
      
    } catch (error) {
      console.error('Erro ao realizar agendamento:', error);
      toast.error('Ocorreu um erro ao realizar o agendamento. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Link de Agendamento Inválido</CardTitle>
            <CardDescription>
              O link de agendamento não possui as informações necessárias.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar para a página inicial
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Agendamento de Instalação</CardTitle>
            <CardDescription>
              {companyName ? `Agende sua instalação de rastreador com ${companyName}` : 'Preencha os dados abaixo para agendar sua instalação'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações de Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite seu nome completo"
                        className="pl-9"
                        required
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="pl-9"
                        required
                      />
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações do Veículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Veículo (Marca/Modelo) *</Label>
                    <Input
                      id="vehicle"
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      placeholder="Ex: Toyota Corolla"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">Placa *</Label>
                    <Input
                      id="licensePlate"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      placeholder="ABC-1234"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Agendamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          locale={ptBR}
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                            date.getDay() === 0 || 
                            date.getDay() === 6
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot">Horário *</Label>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger id="timeSlot" className="w-full">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {slot}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Local *</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger id="location" className="w-full">
                        <SelectValue placeholder="Selecione um local" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLocations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {loc}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Observações</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Alguma informação adicional que queira compartilhar..."
                  rows={3}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => navigate('/')} className="sm:w-auto w-full">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="sm:w-auto w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Agendamento'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PublicScheduling;
