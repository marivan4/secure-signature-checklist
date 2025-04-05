
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AsaasSettings from '@/components/Settings/AsaasSettings';
import WhatsAppSettings from '@/components/WhatsApp/WhatsAppSettings';
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const [activeSettings, setActiveSettings] = useState('general');
  const { user } = useAuth();

  // Only allow admin and reseller
  if (user?.role !== 'admin' && user?.role !== 'reseller') {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>
            Gerencie as configurações e integrações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" value={activeSettings} onValueChange={setActiveSettings}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="asaas">Asaas</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Configurações Gerais</h3>
                <p className="text-sm text-gray-500">
                  Configure as preferências gerais do sistema como nome da empresa, 
                  logotipo, informações de contato e outras configurações básicas.
                </p>
                {/* Adicionar formulário de configurações gerais aqui */}
              </div>
            </TabsContent>
            
            <TabsContent value="asaas">
              <AsaasSettings />
            </TabsContent>
            
            <TabsContent value="whatsapp">
              <WhatsAppSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
