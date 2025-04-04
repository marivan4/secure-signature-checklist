
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Bell, Send, MessageSquare } from 'lucide-react';

const OverdueNotification: React.FC = () => {
  const [enablePush, setEnablePush] = useState(true);
  const [enableWhatsApp, setEnableWhatsApp] = useState(true);
  const [message, setMessage] = useState(
    'Prezado cliente, identificamos que seu veículo está com o rastreamento descoberto devido a pendências financeiras. Por favor, regularize sua situação para evitar o bloqueio do veículo.'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Configurações de notificação salvas com sucesso");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Notificação de teste enviada com sucesso");
    } catch (error) {
      toast.error("Erro ao enviar notificação de teste");
      console.error("Erro ao enviar notificação de teste:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Bell className="mr-2 h-5 w-5 text-primary" />
          Notificações de Inadimplência
        </CardTitle>
        <CardDescription>
          Configure as notificações que serão enviadas aos clientes inadimplentes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notification">Notificação Push</Label>
              <p className="text-sm text-muted-foreground">
                Enviar alerta push quando o cliente ligar a ignição
              </p>
            </div>
            <Switch 
              id="push-notification" 
              checked={enablePush}
              onCheckedChange={setEnablePush}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="whatsapp-notification">Notificação WhatsApp</Label>
              <p className="text-sm text-muted-foreground">
                Enviar mensagem via WhatsApp quando o cliente ligar a ignição
              </p>
            </div>
            <Switch 
              id="whatsapp-notification" 
              checked={enableWhatsApp}
              onCheckedChange={setEnableWhatsApp}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notification-message">Mensagem Personalizada</Label>
          <Textarea 
            id="notification-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite a mensagem que será enviada ao cliente..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Esta mensagem será enviada ao cliente quando ele estiver inadimplente
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleTestNotification}
          disabled={isSaving}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Enviar Teste
        </Button>
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          <Send className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OverdueNotification;
