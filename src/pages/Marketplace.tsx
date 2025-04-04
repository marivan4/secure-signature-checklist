
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Tag, ShoppingCart, Star, BookOpen, Package, ShieldCheck, MapPin, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Sample products
  const products = [
    {
      id: 1,
      name: 'Rastreador GT06N',
      description: 'Rastreador veicular com comunicação GPS/GPRS, bateria interna e bloqueio remoto.',
      price: 299.90,
      category: 'trackers',
      rating: 4.7,
      reviews: 128,
      featured: true,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 2,
      name: 'Plano Mensal Premium',
      description: 'Plano de monitoramento com acesso ao aplicativo, histórico de 90 dias e suporte 24/7.',
      price: 59.90,
      category: 'plans',
      rating: 4.9,
      reviews: 256,
      featured: true,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 3,
      name: 'Kit Instalação Completo',
      description: 'Kit completo para instalação de rastreador incluindo cabos, relés e conectores.',
      price: 149.90,
      category: 'accessories',
      rating: 4.5,
      reviews: 84,
      featured: false,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 4,
      name: 'Seguro Roubo e Furto',
      description: 'Seguro contra roubo e furto para veículos com rastreador instalado.',
      price: 499.90,
      category: 'insurance',
      rating: 4.8,
      reviews: 112,
      featured: true,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 5,
      name: 'Modelo TK103B',
      description: 'Rastreador veicular avançado com microfone, alarme e sensor de movimento.',
      price: 399.90,
      category: 'trackers',
      rating: 4.6,
      reviews: 98,
      featured: false,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 6,
      name: 'Plano Anual Básico',
      description: 'Plano anual de rastreamento com pagamento único e economia de 2 meses.',
      price: 499.90,
      category: 'plans',
      rating: 4.4,
      reviews: 56,
      featured: false,
      image: 'https://via.placeholder.com/300x200'
    },
  ];

  const handleBuyNow = (productId: number) => {
    // Add the product to cart and navigate to checkout
    navigate(`/marketplace/checkout`);
  };

  return (
    <div className="container py-6 md:py-10 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Produtos, serviços e assinaturas para rastreamento veicular
          </p>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'reseller') && (
          <Button asChild>
            <Link to="/marketplace/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-5 mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="trackers">Rastreadores</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="accessories">Acessórios</TabsTrigger>
          <TabsTrigger value="insurance">Seguros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trackers" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.filter(p => p.category === 'trackers').map((product) => (
              <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="plans" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.filter(p => p.category === 'plans').map((product) => (
              <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="accessories" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.filter(p => p.category === 'accessories').map((product) => (
              <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="insurance" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.filter(p => p.category === 'insurance').map((product) => (
              <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Featured section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.filter(p => p.featured).map((product) => (
            <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    reviews: number;
    featured: boolean;
    image: string;
  };
  onBuyNow: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trackers':
        return <MapPin className="h-4 w-4" />;
      case 'plans':
        return <BookOpen className="h-4 w-4" />;
      case 'accessories':
        return <Package className="h-4 w-4" />;
      case 'insurance':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
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
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video w-full relative bg-muted">
        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">Destaque</Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getCategoryIcon(product.category)}
            {getCategoryLabel(product.category)}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
            <span>{product.rating} ({product.reviews})</span>
          </div>
        </div>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-2xl font-bold">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/marketplace/products/${product.id}`}>
            Detalhes
          </Link>
        </Button>
        <Button onClick={() => onBuyNow(product.id)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Comprar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Marketplace;
