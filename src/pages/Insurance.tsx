
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MessageSquare, Users, Wrench, Calendar, Smartphone, Brain } from 'lucide-react';
import OverdueNotification from '@/components/Notifications/OverdueNotification';
import TechnicianManagement from '@/components/Technician/TechnicianManagement';
import SelfScheduling from '@/components/Scheduling/SelfScheduling';
import SimCardManagement from '@/components/SIM/SimCardManagement';
import GuardianSystem from '@/components/Guardian/GuardianSystem';

const InsurancePage: React.FC = () => {
  return (
    <div className="container py-6 md:py-10 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Operações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as operações do seu sistema de rastreamento
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="flex overflow-auto bg-muted mb-6 p-1">
          <TabsTrigger value="notifications" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="technicians" className="flex items-center">
            <Wrench className="mr-2 h-4 w-4" />
            <span>Técnicos</span>
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Agendamento</span>
          </TabsTrigger>
          <TabsTrigger value="sim" className="flex items-center">
            <Smartphone className="mr-2 h-4 w-4" />
            <span>SIM Cards</span>
          </TabsTrigger>
          <TabsTrigger value="guardian" className="flex items-center">
            <Brain className="mr-2 h-4 w-4" />
            <span>Guardião</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <OverdueNotification />
          </div>
        </TabsContent>

        <TabsContent value="technicians">
          <div className="grid grid-cols-1 gap-6">
            <TechnicianManagement />
          </div>
        </TabsContent>

        <TabsContent value="scheduling">
          <div className="grid grid-cols-1 gap-6">
            <SelfScheduling />
          </div>
        </TabsContent>

        <TabsContent value="sim">
          <div className="grid grid-cols-1 gap-6">
            <SimCardManagement />
          </div>
        </TabsContent>

        <TabsContent value="guardian">
          <div className="grid grid-cols-1 gap-6">
            <GuardianSystem />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsurancePage;
