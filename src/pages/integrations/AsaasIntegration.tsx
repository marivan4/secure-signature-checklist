
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AsaasSettings from '@/components/Settings/AsaasSettings';
import { useAuth } from '@/contexts/AuthContext';

const AsaasIntegration: React.FC = () => {
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
      <h1 className="text-3xl font-bold mb-6">Integração com Asaas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Asaas</CardTitle>
          <CardDescription>
            Configure sua integração com a API do Asaas para processamento de pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AsaasSettings />
        </CardContent>
      </Card>
    </div>
  );
};

export default AsaasIntegration;
