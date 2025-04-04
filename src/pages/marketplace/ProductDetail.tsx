
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  DollarSign, 
  Info, 
  MapPin, 
  Package, 
  ShoppingCart, 
  Star, 
  Truck, 
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('boleto');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock product data (in a real application, this would be fetched from an API)
  const product = {
    id: Number(id),
    name: id === '1' ? 'Rastreador GT06N' : 'Kit Instalação Completo',
    description: id === '1' 
      ? 'Rastreador veicular com comunicação GPS/GPRS, bateria interna e bloqueio remoto.' 
      : 'Kit completo para instalação de rastreador incluindo cabos, relés e conectores.',
    price: id === '1' ? 299.90 : 149.90,
    category: id === '1' ? 'trackers' : 'accessories',
    rating: id === '1' ? 4.7 : 4.5,
    reviews: id === '1' ? 128 : 84,
    featured: id === '1' ? true : false,
    image: 'https://via.placeholder.com/600x400',
    stock: 15,
    sku: id === '1' ? 'TRK-GT06N-01' : 'KIT-INST-01',
    warranty: id === '1' ? '12 months' : '3 months',
    installationRequired: id === '1' ? true : false,
    weight: id === '1' ? '150g' : '500g',
    dimensions: id === '1' ? '8 x 4 x 2 cm' : '20 x 15 x 10 cm',
    longDescription: id === '1' 
      ? 'O rastreador GT06N é um dispositivo GPS/GPRS de alta precisão projetado para monitoramento em tempo real de veículos. Com bateria interna que proporciona funcionamento contínuo mesmo em caso de corte da energia do veículo, é a solução ideal para proteção contra roubo e furto. Possui função de bloqueio remoto do veículo através do aplicativo ou SMS, além de monitoramento por geocercas, alertas de velocidade e histórico de percursos. Fácil instalação e compatível com a maioria dos veículos.' 
      : 'Este kit de instalação contém todos os componentes necessários para a instalação profissional de rastreadores veiculares. Inclui cabos de alimentação, chicotes elétricos, relés para função de bloqueio, conectores, terminais, abraçadeiras e isolantes. Todos os componentes são de alta qualidade e testados para garantir a durabilidade e o funcionamento correto do sistema de rastreamento. Indicado para instaladores profissionais e para quem deseja realizar a instalação por conta própria seguindo o manual detalhado incluído no kit.',
    features: id === '1' 
      ? [
          'GPS de alta precisão',
          'Comunicação GPRS em tempo real',
          'Bateria interna de backup',
          'Função de bloqueio remoto',
          'Alertas de velocidade',
          'Geocercas configuráveis',
          'Dimensões compactas',
          'Baixo consumo de energia'
        ] 
      : [
          'Cabos de alimentação de alta qualidade',
          'Relés para função de bloqueio',
          'Conectores e terminais isolados',
          'Abraçadeiras e isolantes',
          'Manual de instalação detalhado',
          'Compatível com diversos modelos de rastreadores',
          'Componentes testados e aprovados'
        ]
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleBuy = () => {
    console.log('Purchase:', { 
      product, 
      quantity, 
      paymentMethod,
      total: product.price * quantity
    });
    
    // In a real application, you would call an API here to create the invoice
    toast({
      title: "Pedido realizado com sucesso!",
      description: `O pagamento de R$ ${(product.price * quantity).toFixed(2).replace('.', ',')} via ${paymentMethod === 'boleto' ? 'boleto' : paymentMethod === 'pix' ? 'PIX' : 'cartão'} foi gerado.`,
    });
    
    // Navigate to a checkout success page or directly to invoice
    setTimeout(() => {
      navigate('/invoices');
    }, 2000);
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'trackers':
        return 'Rastreador';
      case 'plans':
        return 'Plano';
      case 'accessories':
        return 'Acessório';
      case 'insurance':
        return 'Seguro';
      default:
        return category;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center p-4">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-w-full h-auto rounded"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {getCategoryLabel(product.category)}
              </Badge>
              {product.featured && (
                <Badge className="bg-yellow-500">Destaque</Badge>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                <span>{product.rating} ({product.reviews} avaliações)</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="text-3xl font-bold">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="inline-flex items-center rounded-md border border-input bg-background px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground flex items-center">
                <Package className="h-4 w-4 mr-1" />
                {product.stock} unidades em estoque
              </p>
            </div>
            
            <Separator />
            
            <div>
              <div className="font-semibold mb-2">Forma de Pagamento</div>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="boleto" id="boleto" />
                  <Label htmlFor="boleto" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Boleto Bancário
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    PIX
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Cartão de Crédito
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1" 
                onClick={handleBuy}
                disabled={!user}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Comprar Agora
              </Button>
            </div>
            
            {!user && (
              <p className="text-sm text-muted-foreground">
                <Info className="h-4 w-4 inline mr-1 text-yellow-500" />
                Você precisa estar logado para efetuar uma compra.
                <Link to="/login" className="ml-1 text-primary underline">
                  Fazer login
                </Link>
              </p>
            )}
            
            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-4">
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                <span>Envio para todo o Brasil</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <span>Garantia de {product.warranty}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Instalação {product.installationRequired ? 'necessária' : 'opcional'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Entrega em até 7 dias úteis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="description">Descrição</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Descrição do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{product.longDescription}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Principais Características</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">SKU</span>
                    <span>{product.sku}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Peso</span>
                    <span>{product.weight}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Dimensões</span>
                    <span>{product.dimensions}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Garantia</span>
                    <span>{product.warranty}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Categoria</span>
                    <span>{getCategoryLabel(product.category)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Instalação</span>
                    <span>{product.installationRequired ? 'Necessária' : 'Opcional'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Disponibilidade</span>
                    <span>{product.stock > 0 ? 'Em estoque' : 'Indisponível'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
