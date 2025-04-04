
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AsaasSettings } from '@/components/Settings/AsaasSettings';
import WhatsAppSettings from '@/components/WhatsApp/WhatsAppSettings';

const ResellerIntegrations: React.FC = () => {
  const [activeIntegration, setActiveIntegration] = useState('asaas');

  return (
    <TabsContent value="integrations" className="mt-0">
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>
            Configure as integrações com serviços externos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="asaas" value={activeIntegration} onValueChange={setActiveIntegration}>
            <TabsList className="mb-6">
              <TabsTrigger value="asaas">Asaas</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="asaas">
              <AsaasSettings isReseller={true} />
            </TabsContent>
            
            <TabsContent value="whatsapp">
              <WhatsAppSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ResellerIntegrations;
