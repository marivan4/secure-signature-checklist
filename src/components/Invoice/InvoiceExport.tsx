
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ArrowLeft, 
  Download, 
  FileText, 
  Printer 
} from 'lucide-react';
import { toast } from 'sonner';
import { getInvoiceById, exportInvoiceAsPdf } from '@/services/invoiceApi';

const InvoiceExport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [exporting, setExporting] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const { data: invoice, isLoading, isError } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
          <CardDescription>Não foi possível carregar os detalhes da fatura</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/invoices')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Faturas
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      const url = await exportInvoiceAsPdf(invoice.id);
      
      if (url) {
        setPdfUrl(url);
        toast.success('PDF gerado com sucesso');
      } else {
        toast.error('Erro ao gerar PDF');
      }
    } catch (error) {
      toast.error('Erro ao gerar PDF');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      // Abre em nova janela para impressão
      const printWindow = window.open(pdfUrl, '_blank');
      printWindow?.focus();
      setTimeout(() => {
        printWindow?.print();
      }, 1000);
    } else {
      toast.error('Gere o PDF primeiro antes de imprimir');
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      // Cria um elemento a temporário para download
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `Fatura_${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast.error('Gere o PDF primeiro antes de baixar');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Exportar Fatura</CardTitle>
        <CardDescription>
          Exporte a fatura {invoice.invoiceNumber} em formato PDF
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-4 p-6 border rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <p className="text-center">
            Clique no botão abaixo para gerar o PDF da fatura.
          </p>
          <Button 
            onClick={handleExportPdf} 
            disabled={exporting}
            className="w-full md:w-auto"
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Gerar PDF
              </>
            )}
          </Button>
        </div>
        
        {pdfUrl && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">PDF gerado com sucesso!</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir
              </Button>
              <Button variant="outline" onClick={() => window.open(pdfUrl, '_blank')}>
                <FileText className="mr-2 h-4 w-4" /> Visualizar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" onClick={() => navigate(`/invoices/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceExport;
