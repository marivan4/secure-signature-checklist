
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Truck, 
  User, 
  MapPin,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createInvoice } from '@/services/invoiceApi';

// Sample products
const cartItems = [
  {
    id: 1,
    name: 'Rastreador GT06N',
    price: 299.90,
    quantity: 1,
    image: 'https://via.placeholder.com/100'
  },
  {
    id: 3,
    name: 'Kit Instalação Completo',
    price: 149.90,
    quantity: 1,
    image: 'https://via.placeholder.com/100'
  }
];

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('boleto');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Calculate subtotal, shipping, and total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 25.00;
  const total = subtotal + shipping;
  
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para finalizar a compra.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create product description
      const productDescription = cartItems.map(item => 
        `${item.name} (${item.quantity}x)`
      ).join(', ');
      
      // In a real app, you would send this to your backend
      // Here we're using the existing invoiceApi to create an invoice
      const invoice = await createInvoice({
        userId: user.id,
        invoiceNumber: `MP-${Date.now().toString().slice(-6)}`,
        description: `Compra Marketplace: ${productDescription}`,
        amount: total,
        status: 'pending',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        billingType: paymentMethod === 'boleto' ? 'BOLETO' : paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD',
        email: formData.email,
        phone: formData.phone
      });
      
      if (invoice) {
        toast({
          title: "Pedido realizado com sucesso!",
          description: "Seu pedido foi processado e o pagamento foi gerado.",
        });
        
        // Navigate to the invoice detail page
        setTimeout(() => {
          navigate(`/invoices/${invoice.id}`);
        }, 1500);
      } else {
        throw new Error("Falha ao processar o pedido");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/marketplace">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">Voltar para o Marketplace</span>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Customer Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Rua, número, complemento"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                      placeholder="Estado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode" 
                      value={formData.zipCode} 
                      onChange={handleInputChange} 
                      placeholder="00000-000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    placeholder="Informações adicionais para entrega ou instalação"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Forma de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="boleto" id="boleto" />
                  <Label htmlFor="boleto" className="flex flex-1 items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Boleto Bancário
                    </div>
                    <span className="text-sm text-muted-foreground">Vencimento em 3 dias</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex flex-1 items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      PIX
                    </div>
                    <span className="text-sm text-muted-foreground">Pagamento instantâneo</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex flex-1 items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Cartão de Crédito
                    </div>
                    <span className="text-sm text-muted-foreground">Processamento imediato</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                      <span>Qtd: {item.quantity}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>R$ {shipping.toFixed(2).replace('.', ',')}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processando..." : "Finalizar Compra"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>Prazo de entrega: 7 a 10 dias úteis após a confirmação do pagamento</span>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>Produtos novos com garantia do fabricante</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>Produtos enviados com nota fiscal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
