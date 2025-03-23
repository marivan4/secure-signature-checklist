
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChecklistById, signChecklist } from '@/services/api';
import { Checklist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SignaturePad from '@/components/ui/signature-pad';
import { toast } from 'sonner';
import { Loader2, Check, ArrowLeft } from 'lucide-react';

const Signature: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        // For demo purposes, we'll just fetch the first checklist
        // In a real app, we would validate the token and fetch the associated checklist
        const response = await getChecklistById(1);
        
        if (response.success && response.data) {
          setChecklist(response.data);
        } else {
          toast.error('Invalid or expired signature link');
          navigate('/');
        }
      } catch (error) {
        toast.error('An error occurred');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChecklist();
  }, [token, navigate]);
  
  const handleSignature = async (signatureData: string) => {
    if (!token || !checklist) return;
    
    try {
      setSigning(true);
      const response = await signChecklist(token, signatureData);
      
      if (response.success && response.data) {
        setCompleted(true);
        toast.success('Checklist signed successfully');
      } else {
        throw new Error(response.error || 'Failed to sign checklist');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSigning(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!checklist) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Invalid or expired signature link</h2>
        <p className="text-muted-foreground mb-6">The signature link you are trying to access is not valid or has expired.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }
  
  if (completed) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        <div className="rounded-full bg-green-100 p-4 mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Signature Successfully Completed</h2>
        <p className="text-muted-foreground mb-6">Thank you! Your signature has been recorded.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex justify-center items-center p-4 py-12">
      <Card className="w-full max-w-2xl shadow-lg animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Electronic Signature</CardTitle>
          <CardDescription>
            Please review the information and sign the document below
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{checklist.name}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
              <p className="font-medium">{checklist.cpfCnpj}</p>
            </div>
            
            {checklist.vehicleModel && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-medium">{checklist.vehicleModel} - {checklist.licensePlate || 'N/A'}</p>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Terms and Conditions</h3>
            <div className="text-sm text-muted-foreground space-y-2 bg-muted/20 p-4 rounded-md max-h-48 overflow-y-auto">
              <p>
                I hereby acknowledge that all the information provided is correct and accurate to the best of my knowledge.
              </p>
              <p>
                I authorize the installation of the tracking device as specified in this checklist and confirm 
                that I am the legal owner or authorized representative for the vehicle.
              </p>
              <p>
                I understand that this digital signature constitutes a legally binding acceptance of the terms and 
                conditions associated with the tracking service.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Your Signature</h3>
            <p className="text-sm text-muted-foreground">
              Please sign below using your mouse or touch screen
            </p>
            <SignaturePad onSave={handleSignature} disabled={signing} />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 border-t p-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            disabled={signing}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          
          <div className="text-xs text-muted-foreground flex-1 text-center">
            Your IP address ({checklist.ipAddress || '127.0.0.1'}) is being recorded with this signature
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signature;
