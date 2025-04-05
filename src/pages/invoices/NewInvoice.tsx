
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InvoiceForm from '@/components/Invoice/InvoiceForm';
import { useAuth } from '@/contexts/AuthContext';

const NewInvoice: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Nova Fatura</h1>
      </div>
      
      <InvoiceForm />
    </div>
  );
};

export default NewInvoice;
