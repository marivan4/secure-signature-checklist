
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { Plan } from '@/lib/types';

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Lista de planos disponíveis
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Ideal para pequenas frotas',
      price: 79.90,
      features: [
        'Rastreamento em tempo real',
        'Histórico de 30 dias',
        'Suporte em horário comercial',
        'Bloqueio remoto',
        '1 veículo'
      ],
      durationMonths: 1,
      color: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Perfeito para frotas médias',
      price: 159.90,
      features: [
        'Rastreamento em tempo real',
        'Histórico de 90 dias',
        'Suporte 24/7',
        'Bloqueio remoto',
        'Relatórios avançados',
        'Até 5 veículos'
      ],
      durationMonths: 1,
      color: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Solução completa para frotas',
      price: 299.90,
      features: [
        'Rastreamento em tempo real',
        'Histórico ilimitado',
        'Suporte prioritário 24/7',
        'Bloqueio remoto',
        'Relatórios avançados',
        'API de integração',
        'Veículos ilimitados'
      ],
      durationMonths: 1,
      color: 'bg-green-100 dark:bg-green-900',
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      toast.error('Por favor, selecione um plano para continuar.');
      return;
    }

    // Redireciona para a página de registro de cliente com o plano selecionado
    navigate(`/clients/new?plan=${selectedPlan}`);
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Escolha o Plano Ideal</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Selecione o plano que melhor atende às suas necessidades. Todos os planos incluem monitoramento 24 horas e suporte técnico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative overflow-hidden border-2 transition-all ${
              selectedPlan === plan.id 
                ? 'border-primary shadow-lg scale-105' 
                : 'border-transparent hover:border-primary/20'
            }`}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.id === 'premium' && (
              <Badge className="absolute top-4 right-4 bg-purple-500">Mais Popular</Badge>
            )}
            
            <div className={`h-2 w-full ${plan.color}`} />
            
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-base">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              
              <ul className="space-y-2 my-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={selectedPlan === plan.id ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSelectPlan(plan.id)}
              >
                {selectedPlan === plan.id ? 'Selecionado' : 'Selecionar Plano'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-12">
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="gap-2"
        >
          Continuar para Cadastro <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Plans;
