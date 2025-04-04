
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Brain, AlertTriangle, ChevronRight, Shield, Clock, BellRing } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AlertRule {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const GuardianSystem: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isScanRunning, setIsScanRunning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<{
    total: number;
    alerts: number;
    completed: string;
  } | null>(null);
  
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 1,
      name: 'Inadimplência',
      description: 'Alerta clientes com faturas vencidas há mais de 5 dias',
      enabled: true,
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />
    },
    {
      id: 2,
      name: 'Sem transmissão',
      description: 'Identifica veículos sem transmissão há mais de 24 horas',
      enabled: true,
      icon: <Clock className="h-4 w-4 text-orange-500" />
    },
    {
      id: 3,
      name: 'Violação de cerca',
      description: 'Detecta veículos que saíram de perímetros configurados',
      enabled: true,
      icon: <Shield className="h-4 w-4 text-blue-500" />
    },
    {
      id: 4,
      name: 'Bateria baixa',
      description: 'Alerta sobre rastreadores com bateria abaixo de 20%',
      enabled: true,
      icon: <BellRing className="h-4 w-4 text-red-500" />
    }
  ]);

  const toggleRule = (id: number) => {
    setAlertRules(
      alertRules.map(rule => 
        rule.id === id 
          ? { ...rule, enabled: !rule.enabled } 
          : rule
      )
    );
    
    const rule = alertRules.find(rule => rule.id === id);
    if (rule) {
      toast.success(`Regra "${rule.name}" ${rule.enabled ? 'desativada' : 'ativada'} com sucesso`);
    }
  };

  const runScan = async () => {
    if (isScanRunning) return;
    
    try {
      setIsScanRunning(true);
      setScanProgress(0);
      setScanResults(null);
      
      // Simula escaneamento progressivo
      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanProgress(i * 10);
      }
      
      // Simula resultados
      setScanResults({
        total: 45,
        alerts: 7,
        completed: new Date().toISOString()
      });
      
      toast.success("Escaneamento concluído com sucesso");
    } catch (error) {
      toast.error("Erro ao executar escaneamento");
      console.error("Erro ao executar escaneamento:", error);
    } finally {
      setIsScanRunning(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          Guardião - IA de Monitoramento
        </CardTitle>
        <CardDescription>
          Sistema inteligente de monitoramento automático da sua frota
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="guardian-toggle">Sistema Guardião</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativa o monitoramento automático da sua frota
                  </p>
                </div>
                <Switch 
                  id="guardian-toggle" 
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Status do Sistema</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Estado:</span>
                    <Badge variant={isEnabled ? "default" : "secondary"}>
                      {isEnabled ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Regras ativas:</span>
                    <span className="font-medium">{alertRules.filter(r => r.enabled).length} / {alertRules.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Último escaneamento:</span>
                    <span className="text-sm">
                      {scanResults ? new Date(scanResults.completed).toLocaleString('pt-BR') : "Nunca executado"}
                    </span>
                  </div>
                  
                  {scanResults && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Veículos escaneados:</span>
                        <span className="font-medium">{scanResults.total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Alertas gerados:</span>
                        <span className="font-medium text-amber-600">{scanResults.alerts}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {isScanRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Escaneamento em progresso...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              )}
              
              <Button 
                onClick={runScan} 
                disabled={isScanRunning || !isEnabled}
                className="w-full"
              >
                {isScanRunning ? "Escaneamento em andamento..." : "Executar escaneamento agora"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="rules">
            <div className="space-y-4">
              {alertRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {rule.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                      disabled={!isEnabled}
                    />
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <p className="text-sm text-muted-foreground">
          O sistema Guardião realiza escaneamentos automáticos da sua frota a cada 4 horas e notifica sobre potenciais problemas.
        </p>
      </CardFooter>
    </Card>
  );
};

export default GuardianSystem;
