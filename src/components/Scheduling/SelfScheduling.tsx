
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CalendarDays, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const SelfScheduling: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(
    'Olá! Agende sua instalação de rastreador através do nosso sistema de auto agendamento. É rápido e fácil!'
  );
  const selfSchedulingLink = 'https://app7.narrota.com.br/schedule?company=example';

  const copyLink = () => {
    navigator.clipboard.writeText(selfSchedulingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copiado para a área de transferência");
  };

  const handleSaveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Configurações de auto agendamento salvas com sucesso");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error("Erro ao salvar configurações:", error);
    }
  };
  
  const generateWhatsAppLink = () => {
    const encodedMessage = encodeURIComponent(`${message}\n\n${selfSchedulingLink}`);
    return `https://wa.me/?text=${encodedMessage}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-primary" />
          Auto Agendamento
        </CardTitle>
        <CardDescription>
          Configure o link de auto agendamento para seus clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="self-scheduling">Habilitar Auto Agendamento</Label>
            <p className="text-sm text-muted-foreground">
              Permite que clientes agendem instalações diretamente pelo link
            </p>
          </div>
          <Switch 
            id="self-scheduling" 
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Link de Auto Agendamento</Label>
          <div className="flex gap-2">
            <Input value={selfSchedulingLink} readOnly className="flex-1" />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={copyLink}
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Compartilhe este link com seus clientes para que eles possam agendar instalações
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scheduling-message">Mensagem de Convite</Label>
          <Textarea 
            id="scheduling-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite a mensagem que será enviada junto com o link..."
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <LinkIcon className="mr-2 h-4 w-4" />
            Compartilhar via WhatsApp
          </Button>
        </a>
        <Button onClick={handleSaveSettings}>
          Salvar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SelfScheduling;
