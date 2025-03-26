
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  RefreshCw, 
  Link, 
  CheckCircle, 
  XCircle, 
  Send,
  Smartphone,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface WhatsAppConfig {
  apiKey: string;
  instance: string;
  baseUrl: string;
}

interface ConnectionState {
  connected: boolean;
  state: string;
  qrCode?: string;
}

const WhatsAppSettings: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<WhatsAppConfig>({
    apiKey: 'd9919cda7e370839d33b8946584dac93', // Default admin API Key
    instance: 'assas',
    baseUrl: 'https://evolutionapi.gpstracker-16.com.br'
  });
  
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    connected: false,
    state: 'disconnected'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingState, setIsCheckingState] = useState(false);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState('connection');
  
  useEffect(() => {
    // Carregar configuração salva quando componente monta
    const loadSavedConfig = async () => {
      try {
        // Em produção, buscaria da API
        if (import.meta.env.PROD) {
          // Implementar quando API estiver pronta
        } else {
          // Em desenvolvimento, usa localStorage
          const savedConfig = localStorage.getItem('whatsappConfig');
          if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    };
    
    loadSavedConfig();
    // Verificar estado de conexão inicial
    checkConnectionState();
  }, []);
  
  const saveConfig = async () => {
    try {
      setIsLoading(true);
      
      // Em produção, salvaria na API
      if (import.meta.env.PROD) {
        // Implementar quando API estiver pronta
      } else {
        // Em desenvolvimento, salva no localStorage
        localStorage.setItem('whatsappConfig', JSON.stringify(config));
      }
      
      toast.success('Configuração salva com sucesso');
      await checkConnectionState();
    } catch (error) {
      toast.error('Erro ao salvar configuração');
      console.error('Erro ao salvar configuração:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkConnectionState = async () => {
    try {
      setIsCheckingState(true);
      
      // Em desenvolvimento, simula resposta da API
      if (!import.meta.env.PROD) {
        // Simulação para desenvolvimento
        setTimeout(() => {
          setConnectionState({
            connected: Math.random() > 0.5,
            state: Math.random() > 0.5 ? 'connected' : 'disconnected'
          });
          setIsCheckingState(false);
        }, 1000);
        return;
      }
      
      // Em produção, consulta API
      const response = await axios.get(
        `${config.baseUrl}/instance/connectionState/${config.instance}`,
        { headers: { apikey: config.apiKey } }
      );
      
      setConnectionState({
        connected: response.data?.state === 'open',
        state: response.data?.state || 'disconnected'
      });
    } catch (error) {
      console.error('Erro ao verificar estado da conexão:', error);
      setConnectionState({
        connected: false,
        state: 'error'
      });
      toast.error('Erro ao verificar estado da conexão');
    } finally {
      setIsCheckingState(false);
    }
  };
  
  const generateQrCode = async () => {
    try {
      setIsLoading(true);
      
      // Em desenvolvimento, simula resposta da API
      if (!import.meta.env.PROD) {
        // Simulação para desenvolvimento
        setTimeout(() => {
          setConnectionState({
            ...connectionState,
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
          });
          toast.success('QR Code gerado com sucesso');
          setIsLoading(false);
        }, 1500);
        return;
      }
      
      // Em produção, consulta API
      const response = await axios.get(
        `${config.baseUrl}/instance/connect/${config.instance}`,
        { headers: { apikey: config.apiKey } }
      );
      
      if (response.data.qrcode) {
        setConnectionState({
          ...connectionState,
          qrCode: response.data.qrcode
        });
        toast.success('QR Code gerado com sucesso');
      } else {
        toast.error('Erro ao gerar QR Code');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code');
    } finally {
      setIsLoading(false);
    }
  };
  
  const restartInstance = async () => {
    try {
      setIsLoading(true);
      
      // Em desenvolvimento, simula resposta da API
      if (!import.meta.env.PROD) {
        // Simulação para desenvolvimento
        setTimeout(() => {
          setConnectionState({
            connected: false,
            state: 'disconnected',
            qrCode: undefined
          });
          toast.success('Instância reiniciada com sucesso');
          setIsLoading(false);
        }, 1500);
        return;
      }
      
      // Em produção, consulta API
      await axios.get(
        `${config.baseUrl}/instance/restart/${config.instance}`,
        { headers: { apikey: config.apiKey } }
      );
      
      toast.success('Instância reiniciada com sucesso');
      checkConnectionState();
    } catch (error) {
      console.error('Erro ao reiniciar instância:', error);
      toast.error('Erro ao reiniciar instância');
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnectInstance = async () => {
    try {
      setIsLoading(true);
      
      // Em desenvolvimento, simula resposta da API
      if (!import.meta.env.PROD) {
        // Simulação para desenvolvimento
        setTimeout(() => {
          setConnectionState({
            connected: false,
            state: 'disconnected',
            qrCode: undefined
          });
          toast.success('Instância desconectada com sucesso');
          setIsLoading(false);
        }, 1500);
        return;
      }
      
      // Em produção, consulta API
      await axios.get(
        `${config.baseUrl}/instance/logout/${config.instance}`,
        { headers: { apikey: config.apiKey } }
      );
      
      toast.success('Instância desconectada com sucesso');
      checkConnectionState();
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
      toast.error('Erro ao desconectar instância');
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendMessage = async () => {
    if (!phone || !message) {
      toast.error('Número e mensagem são obrigatórios');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Formata o número para o padrão brasileiro
      let formattedPhone = phone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('55')) {
        formattedPhone = `55${formattedPhone}`;
      }
      
      // Valida formato do número
      if (formattedPhone.length < 12) {
        toast.error('Número de telefone inválido');
        setIsLoading(false);
        return;
      }
      
      // Em desenvolvimento, simula resposta da API
      if (!import.meta.env.PROD) {
        // Simulação para desenvolvimento
        setTimeout(() => {
          toast.success(`Mensagem enviada para ${formattedPhone}`);
          setIsLoading(false);
        }, 1500);
        return;
      }
      
      // Em produção, usa a API
      await axios.post(
        `${config.baseUrl}/message/sendText/${config.instance}`,
        {
          number: formattedPhone,
          text: message
        },
        { headers: { apikey: config.apiKey } }
      );
      
      toast.success('Mensagem enviada com sucesso');
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verifica se o usuário tem permissão de administrador
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie a conexão e envio de mensagens pelo WhatsApp
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="connection" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
          <TabsTrigger value="connection">
            <Smartphone className="mr-2 h-4 w-4" /> Conexão
          </TabsTrigger>
          <TabsTrigger value="messaging" disabled={!connectionState.connected}>
            <Send className="mr-2 h-4 w-4" /> Mensagens
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do WhatsApp</CardTitle>
              <CardDescription>
                Configure a conexão com a API do WhatsApp e gerencie o status da conexão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">URL da API</Label>
                    <Input 
                      id="baseUrl" 
                      placeholder="https://exemplo.com"
                      value={config.baseUrl}
                      onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                      disabled={!isAdmin}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instance">Nome da Instância</Label>
                    <Input 
                      id="instance" 
                      placeholder="default"
                      value={config.instance}
                      onChange={(e) => setConfig({...config, instance: e.target.value})}
                      disabled={!isAdmin}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Chave da API</Label>
                  <Input 
                    id="apiKey" 
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                    disabled={!isAdmin}
                  />
                </div>
                
                {isAdmin && (
                  <Button 
                    onClick={saveConfig} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Configuração
                  </Button>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-lg mb-4">Status da Conexão</h3>
                
                <div className="flex items-center justify-between mb-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center">
                    {connectionState.connected ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className="font-medium">
                      {connectionState.connected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={checkConnectionState}
                    disabled={isCheckingState}
                  >
                    {isCheckingState ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connectionState.connected ? (
                    <Button 
                      variant="destructive" 
                      onClick={disconnectInstance}
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Desconectar
                    </Button>
                  ) : (
                    <Button 
                      onClick={generateQrCode}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <QrCode className="mr-2 h-4 w-4" />
                      )}
                      Gerar QR Code
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={restartInstance}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Reiniciar Instância
                  </Button>
                </div>
                
                {connectionState.qrCode && !connectionState.connected && (
                  <div className="mt-6 flex flex-col items-center">
                    <h4 className="font-medium mb-2">Escaneie o código QR com seu WhatsApp</h4>
                    <div className="border p-4 rounded-lg bg-white">
                      <img src={connectionState.qrCode} alt="QR Code" className="w-64 h-64" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Abra o WhatsApp no seu celular, vá em Menu &gt; Dispositivos Conectados &gt; Conectar um dispositivo
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messaging">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensagem</CardTitle>
              <CardDescription>
                Envie mensagens diretamente pelo WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Número de Telefone</Label>
                <Input 
                  id="phone" 
                  placeholder="(99) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Formato: DDD + número (ex: 11999999999)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full min-h-24 p-3 border border-input bg-background rounded-md"
                  placeholder="Digite sua mensagem aqui..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !message || !phone}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppSettings;
