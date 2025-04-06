
import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';

import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import NewClient from '@/pages/clients/NewClient';
import Invoices from '@/pages/Invoices';
import Login from '@/pages/Login';
import MainLayout from '@/components/Layout/MainLayout';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Trackers from '@/pages/Trackers';
import TrackerForm from '@/pages/trackers/TrackerForm';
import TrackerDetail from '@/pages/trackers/TrackerDetail';
import Plans from '@/pages/Plans';
import Insurance from '@/pages/Insurance';
import Signature from '@/pages/Signature';
import PublicScheduling from '@/pages/scheduling/PublicScheduling';
import Marketplace from '@/pages/Marketplace';
import ProductDetail from '@/pages/marketplace/ProductDetail';
import Checkout from '@/pages/marketplace/Checkout';
import WhatsAppSettings from '@/components/WhatsApp/WhatsAppSettings';
import Resellers from '@/pages/Resellers';
import ResellerForm from '@/pages/resellers/ResellerForm';
import ResellerDetail from '@/pages/resellers/ResellerDetail';

// Import new pages
import NewInvoice from '@/pages/invoices/NewInvoice';
import Settings from '@/pages/Settings';
import AsaasIntegration from '@/pages/integrations/AsaasIntegration';

// Reseller Dashboard Components
import ResellerDashboard from '@/pages/reseller-dashboard/ResellerDashboard';
import ResellerHome from '@/pages/reseller-dashboard/ResellerHome';
import ResellerClients from '@/pages/reseller-dashboard/ResellerClients';
import ResellerFinance from '@/pages/reseller-dashboard/ResellerFinance';
import ResellerIntegrations from '@/pages/reseller-dashboard/ResellerIntegrations';

import './App.css';

// Create a client
const queryClient = new QueryClient();

// Layout wrapper component to handle the Outlet
const LayoutWrapper = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

function App() {
  useEffect(() => {
    document.title = 'Track\'n\'Me';
  }, []);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <SonnerToaster richColors position="bottom-center" />
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route element={<LayoutWrapper />}>
            {/* Default redirect to dashboard */}
            <Route path="" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<NewClient />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<NewInvoice />} />
            <Route path="/trackers" element={<Trackers />} />
            <Route path="/trackers/new" element={<TrackerForm />} />
            <Route path="/trackers/:id" element={<TrackerDetail />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/product/:id" element={<ProductDetail />} />
            <Route path="/marketplace/checkout" element={<Checkout />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/whatsapp" element={<WhatsAppSettings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/integrations/asaas" element={<AsaasIntegration />} />
            <Route path="/resellers" element={<Resellers />} />
            <Route path="/resellers/new" element={<ResellerForm />} />
            <Route path="/resellers/:id" element={<ResellerDetail />} />
            <Route path="/resellers/:id/edit" element={<ResellerForm />} />
            
            {/* Reseller Dashboard Routes */}
            <Route path="/reseller-dashboard" element={<ResellerDashboard />}>
              <Route index element={<ResellerHome />} />
              <Route path="clients" element={<ResellerClients />} />
              <Route path="finance" element={<ResellerFinance />} />
              <Route path="integrations" element={<ResellerIntegrations />} />
            </Route>
          </Route>
          <Route path="/scheduling" element={<PublicScheduling />} />
          <Route path="/signature/:checklistId" element={<Signature />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
