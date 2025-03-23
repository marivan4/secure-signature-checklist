
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChecklist } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checklist } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const ChecklistForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    cpfCnpj: '',
    name: '',
    address: '',
    addressNumber: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    vehicleModel: '',
    licensePlate: '',
    trackerModel: '',
    trackerImei: '',
    registrationDate: new Date().toISOString().split('T')[0],
    installationLocation: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cpfCnpj || !formData.name || !formData.email || !formData.registrationDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error('You must be logged in');
      }
      
      const newChecklist: Omit<Checklist, 'id' | 'createdAt'> = {
        ...formData,
        userId: user.id,
        status: 'pending',
      };
      
      const response = await createChecklist(newChecklist);
      
      if (response.success && response.data) {
        toast.success('Checklist created successfully');
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Failed to create checklist');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full shadow-sm animate-scale-in">
      <CardHeader>
        <CardTitle>Create New Checklist</CardTitle>
        <CardDescription>
          Fill in the information below to create a new checklist. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">
                  CPF/CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cpfCnpj"
                  name="cpfCnpj"
                  placeholder="000.000.000-00"
                  value={formData.cpfCnpj}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Street name"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressNumber">Number</Label>
                  <Input
                    id="addressNumber"
                    name="addressNumber"
                    placeholder="123"
                    value={formData.addressNumber}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    placeholder="Neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {/* Vehicle and Tracker Information */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Vehicle & Tracker Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    name="vehicleModel"
                    placeholder="Make and model"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    name="licensePlate"
                    placeholder="ABC-1234"
                    value={formData.licensePlate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackerModel">Tracker Model</Label>
                  <Input
                    id="trackerModel"
                    name="trackerModel"
                    placeholder="Tracker model"
                    value={formData.trackerModel}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trackerImei">Tracker IMEI</Label>
                  <Input
                    id="trackerImei"
                    name="trackerImei"
                    placeholder="15-digit IMEI number"
                    value={formData.trackerImei}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="registrationDate">
                  Registration Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="registrationDate"
                  name="registrationDate"
                  type="date"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installationLocation">Installation Location</Label>
                <Input
                  id="installationLocation"
                  name="installationLocation"
                  placeholder="Where the tracker was installed"
                  value={formData.installationLocation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Checklist'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ChecklistForm;
