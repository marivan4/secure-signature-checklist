
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChecklists, generateSignatureLink, sendWhatsAppSignatureLink } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Checklist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { ChevronRight, Search, Send, Loader2, FileCheck, Check, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ChecklistTableProps {
  filterStatus?: Checklist['status'];
}

const ChecklistTable: React.FC<ChecklistTableProps> = ({ filterStatus }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingLink, setSendingLink] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setLoading(true);
        const response = await getChecklists(user?.role === 'client' ? user.id : undefined);
        
        if (response.success && response.data) {
          let filteredData = response.data;
          
          if (filterStatus) {
            filteredData = filteredData.filter(checklist => checklist.status === filterStatus);
          }
          
          setChecklists(filteredData);
        } else {
          // Ensure checklists is always initialized as an empty array
          setChecklists([]);
        }
      } catch (error) {
        toast.error('Failed to fetch checklists');
        // Ensure checklists is always initialized as an empty array in case of errors
        setChecklists([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChecklists();
  }, [user, filterStatus]);
  
  // Make sure checklists is always treated as an array
  const filteredChecklists = (checklists || []).filter(checklist => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      checklist.name.toLowerCase().includes(query) ||
      checklist.cpfCnpj.toLowerCase().includes(query) ||
      (checklist.email && checklist.email.toLowerCase().includes(query)) ||
      (checklist.phone && checklist.phone.toLowerCase().includes(query)) ||
      (checklist.licensePlate && checklist.licensePlate.toLowerCase().includes(query))
    );
  });
  
  const handleGenerateAndSendLink = async (checklistId: number, phone?: string) => {
    if (!phone) {
      toast.error('No phone number available for this checklist');
      return;
    }
    
    try {
      setSendingLink(checklistId);
      
      // Generate the signature link
      const linkResponse = await generateSignatureLink(checklistId);
      
      if (!linkResponse.success || !linkResponse.data) {
        throw new Error(linkResponse.error || 'Failed to generate signature link');
      }
      
      // Send the link via WhatsApp
      const sendResponse = await sendWhatsAppSignatureLink(phone, linkResponse.data);
      
      if (!sendResponse.success) {
        throw new Error(sendResponse.error || 'Failed to send WhatsApp message');
      }
      
      toast.success('Signature link sent successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSendingLink(null);
    }
  };
  
  const getStatusBadge = (status: Checklist['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'signed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Signed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (status: Checklist['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'signed':
        return <Check className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <FileCheck className="h-4 w-4 text-green-500" />;
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
  
  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search checklists..."
            className="pl-9 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {user?.role === 'admin' && (
          <Button onClick={() => navigate('/checklist/new')}>
            New Checklist
          </Button>
        )}
      </div>
      
      {filteredChecklists.length === 0 ? (
        <div className="text-center py-12 space-y-3 bg-muted/30 rounded-lg">
          <div className="text-muted-foreground">No checklists found</div>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChecklists.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell className="font-medium">{checklist.name}</TableCell>
                  <TableCell>{checklist.cpfCnpj}</TableCell>
                  <TableCell>{formatDate(checklist.registrationDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(checklist.status)}
                      {getStatusBadge(checklist.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/checklist/${checklist.id}`)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {user?.role === 'admin' && checklist.status === 'pending' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!checklist.phone || sendingLink === checklist.id}
                              title="Send signature link"
                            >
                              {sendingLink === checklist.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Send Signature Link</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will generate a signature link and send it via WhatsApp to{' '}
                                <span className="font-medium">{checklist.phone}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleGenerateAndSendLink(checklist.id, checklist.phone)}
                              >
                                Send Link
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/checklist/${checklist.id}`)}
                        title="View details"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ChecklistTable;
