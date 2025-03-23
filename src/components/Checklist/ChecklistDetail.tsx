
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChecklistById, updateChecklistStatus } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Checklist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Clock, Check, FileCheck, CalendarIcon, MapPinIcon, UserIcon, PhoneIcon, MailIcon, CarIcon, InfoIcon } from 'lucide-react';

const ChecklistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getChecklistById(parseInt(id));
        
        if (response.success && response.data) {
          setChecklist(response.data);
        } else {
          toast.error(response.error || 'Failed to fetch checklist');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('An error occurred');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChecklist();
  }, [id, navigate]);
  
  const handleStatusUpdate = async (newStatus: Checklist['status']) => {
    if (!id || !checklist) return;
    
    try {
      setUpdating(true);
      const response = await updateChecklistStatus(parseInt(id), newStatus);
      
      if (response.success && response.data) {
        setChecklist(response.data);
        toast.success(`Status updated to ${newStatus}`);
      } else {
        throw new Error(response.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setUpdating(false);
    }
  };
  
  const getStatusBadge = (status: Checklist['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'signed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Signed</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (status: Checklist['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'signed':
        return <Check className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <FileCheck className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!checklist) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-bold">Checklist not found</h2>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(checklist.status)}
          <h2 className="text-2xl font-bold">Checklist Details</h2>
          {getStatusBadge(checklist.status)}
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">{checklist.name}</CardTitle>
              <CardDescription>CPF/CNPJ: {checklist.cpfCnpj}</CardDescription>
            </div>
            
            {user?.role === 'admin' && (
              <div className="flex gap-2">
                {checklist.status === 'pending' && (
                  <Button 
                    onClick={() => handleStatusUpdate('signed')}
                    disabled={updating}
                  >
                    {updating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Mark as Signed
                  </Button>
                )}
                
                {checklist.status === 'signed' && (
                  <Button 
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={updating}
                  >
                    {updating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileCheck className="mr-2 h-4 w-4" />
                    )}
                    Complete
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{checklist.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                <p className="font-medium">{checklist.cpfCnpj}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-medium">{formatDate(checklist.registrationDate)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                  {checklist.email || 'N/A'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium flex items-center gap-1">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  {checklist.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Address Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Address</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Street</p>
                <p className="font-medium">{checklist.address || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Number</p>
                <p className="font-medium">{checklist.addressNumber || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Neighborhood</p>
                <p className="font-medium">{checklist.neighborhood || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{checklist.city || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">State</p>
                <p className="font-medium">{checklist.state || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ZIP Code</p>
                <p className="font-medium">{checklist.zipCode || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Vehicle & Tracker Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CarIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Vehicle & Tracker</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Vehicle Model</p>
                <p className="font-medium">{checklist.vehicleModel || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">License Plate</p>
                <p className="font-medium">{checklist.licensePlate || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tracker Model</p>
                <p className="font-medium">{checklist.trackerModel || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tracker IMEI</p>
                <p className="font-medium">{checklist.trackerImei || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Installation Location</p>
                <p className="font-medium">{checklist.installationLocation || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Signature Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Signature Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(checklist.status)}
                  <p className="font-medium">{checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1)}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IP Address</p>
                <p className="font-medium">{checklist.ipAddress || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {formatDate(checklist.createdAt)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Signed At</p>
                <p className="font-medium flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {checklist.signedAt ? formatDate(checklist.signedAt) : 'Not signed yet'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          {user?.role === 'admin' && checklist.status === 'pending' && (
            <Button onClick={() => navigate(`/signature/${id}`)}>
              View Signature Page
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChecklistDetail;
