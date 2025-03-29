import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/Layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signature from "./pages/Signature";
import NotFound from "./pages/NotFound";
import ChecklistForm from "@/components/Checklist/ChecklistForm";
import ChecklistDetail from "@/components/Checklist/ChecklistDetail";
import InvoicePage from "./pages/Invoices";
import WhatsAppSettings from "./components/WhatsApp/WhatsAppSettings";
import AsaasSettings from "./components/Settings/AsaasSettings";
import { useState, StrictMode } from "react";
import InvoiceForm from "./components/Invoice/InvoiceForm";
import InvoiceDetail from "./components/Invoice/InvoiceDetail";
import InvoiceSend from "./components/Invoice/InvoiceSend";
import InvoiceExport from "./components/Invoice/InvoiceExport";
import Clients from "./pages/Clients";
import Trackers from "./pages/Trackers";
import Marketplace from "./pages/Marketplace";
import Insurance from "./pages/Insurance";
import Plans from "./pages/Plans";
import NewClient from "./pages/clients/NewClient";
import TrackerForm from "./pages/trackers/TrackerForm";
import TrackerDetail from "./pages/trackers/TrackerDetail";
import ClientCharge from "./pages/charges/ClientCharge";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/clients" 
      element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } 
    />

    <Route 
      path="/clients/new" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <NewClient />
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/clients/:clientId/charge" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <ClientCharge />
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/plans" 
      element={
        <ProtectedRoute>
          <Plans />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/trackers" 
      element={
        <ProtectedRoute>
          <Trackers />
        </ProtectedRoute>
      } 
    />

    <Route 
      path="/trackers/new" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <TrackerForm />
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/trackers/edit/:id" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <TrackerForm />
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/trackers/:id" 
      element={
        <ProtectedRoute>
          <TrackerDetail />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/marketplace" 
      element={
        <ProtectedRoute>
          <Marketplace />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/insurance" 
      element={
        <ProtectedRoute>
          <Insurance />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/checklist/new" 
      element={
        <ProtectedRoute>
          <AdminRoute>
            <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
              <ChecklistForm />
            </div>
          </AdminRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/checklist/:id" 
      element={
        <ProtectedRoute>
          <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
            <ChecklistDetail />
          </div>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/invoices" 
      element={
        <ProtectedRoute>
          <InvoicePage />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/invoices/new" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
              <InvoiceForm />
            </div>
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/invoices/edit/:id" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
              <InvoiceForm />
            </div>
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/invoices/:id" 
      element={
        <ProtectedRoute>
          <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
            <InvoiceDetail />
          </div>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/invoices/:id/send" 
      element={
        <ProtectedRoute>
          <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
            <InvoiceSend />
          </div>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/invoices/:id/export" 
      element={
        <ProtectedRoute>
          <div className="container py-6 md:py-10 px-4 max-w-4xl mx-auto">
            <InvoiceExport />
          </div>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/whatsapp" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <WhatsAppSettings />
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/settings/asaas" 
      element={
        <ProtectedRoute>
          <ManagerRoute>
            <AsaasSettings />
          </ManagerRoute>
        </ProtectedRoute>
      } 
    />
    
    <Route path="/signature/:token" element={<Signature />} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <MainLayout>
                <AppRoutes />
              </MainLayout>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
