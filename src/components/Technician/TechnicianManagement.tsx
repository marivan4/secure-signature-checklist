import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Wrench, CheckSquare, FileText, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Technician {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  installationsCount: number;
  checksCount: number;
}

const mockTechnicians: Technician[] = [
  {
    id: 1,
    name: 'João Silva',
    phone: '(11) 99999-8888',
    email: 'joao@example.com',
    status: 'active',
    installationsCount: 24,
    checksCount: 18
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    phone: '(11) 97777-6666',
    email: 'maria@example.com',
    status: 'active',
    installationsCount: 32,
    checksCount: 29
  },
  {
    id: 3,
    name: 'Pedro Santos',
    phone: '(11) 95555-4444',
    email: 'pedro@example.com',
    status: 'inactive',
    installationsCount: 15,
    checksCount: 12
  }
];

const TechnicianManagement: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTechnician, setNewTechnician] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleAddTechnician = () => {
    if (!newTechnician.name || !newTechnician.phone || !newTechnician.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newId = Math.max(...technicians.map(t => t.id), 0) + 1;
    const technicianToAdd: Technician = {
      id: newId,
      name: newTechnician.name,
      phone: newTechnician.phone,
      email: newTechnician.email,
      status: 'active',
      installationsCount: 0,
      checksCount: 0
    };

    setTechnicians([...technicians, technicianToAdd]);
    setNewTechnician({ name: '', phone: '', email: '' });
    setIsAddDialogOpen(false);
    toast.success("Técnico adicionado com sucesso");
  };

  const toggleTechnicianStatus = (id: number) => {
    setTechnicians(
      technicians.map(tech => 
        tech.id === id 
          ? { ...tech, status: tech.status === 'active' ? 'inactive' : 'active' } 
          : tech
      )
    );
    
    const technician = technicians.find(tech => tech.id === id);
    if (technician) {
      const newStatus = technician.status === 'active' ? 'inativo' : 'ativo';
      toast.success(`Status do técnico alterado para ${newStatus}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Wrench className="mr-2 h-5 w-5 text-primary" />
          Gestão de Técnicos
        </CardTitle>
        <CardDescription>
          Gerencie os técnicos, instalações e checklists
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Técnico
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Técnico</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo técnico para adicioná-lo ao sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input 
                    id="name" 
                    value={newTechnician.name}
                    onChange={(e) => setNewTechnician({...newTechnician, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={newTechnician.phone}
                    onChange={(e) => setNewTechnician({...newTechnician, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newTechnician.email}
                    onChange={(e) => setNewTechnician({...newTechnician, email: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddTechnician}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Instalações</TableHead>
                <TableHead>Checklists</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{tech.phone}</div>
                      <div className="text-muted-foreground">{tech.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={tech.status === 'active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleTechnicianStatus(tech.id)}
                    >
                      {tech.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{tech.installationsCount}</TableCell>
                  <TableCell>{tech.checksCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianManagement;
