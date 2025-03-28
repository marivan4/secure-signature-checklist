
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Plan } from '@/lib/types';

const Plans: React.FC = () => {
  const navigate = useNavigate();
  
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
    navigate(`/clients/new?plan=${planId}`);
  };

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Escolha o Plano Ideal</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Oferecemos planos flexíveis para atender às suas necessidades de rastreamento.
          Escolha o plano que melhor se adapta à sua frota.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col h-full">
            <div className={`h-2 w-full ${plan.color}`} />
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <div className="text-3xl font-bold">{formatCurrency(plan.price)}</div>
                <p className="text-muted-foreground text-sm">por mês</p>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full gap-2" 
                onClick={() => handleSelectPlan(plan.id)}
              >
                Contratar 
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Precisa de um plano personalizado para sua empresa?
        </p>
        <Button variant="outline" onClick={() => navigate('/contact')}>
          Entre em contato conosco
        </Button>
      </div>
    </div>
  );
};

export default Plans;
