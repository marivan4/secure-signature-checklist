
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Database, Play, Download, Clock, Table } from 'lucide-react';
import axios from 'axios';

interface QueryResult {
  success: boolean;
  message: string;
  data: any[] | null;
  query: string;
  execution_time: number;
  row_count?: number;
  error_details?: {
    code: string;
    line: number;
  };
}

const QueryExecutor: React.FC = () => {
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10");
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error("A consulta não pode estar vazia");
      return;
    }

    try {
      setIsExecuting(true);
      
      const response = await axios.post('/api/execute-query.php', {
        query: query.trim()
      });
      
      setResult(response.data);
      
      if (response.data.success) {
        toast.success(`Consulta executada com sucesso em ${response.data.execution_time}s`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Erro ao executar consulta:', error);
      toast.error('Erro ao executar a consulta. Verifique o console para mais detalhes.');
    } finally {
      setIsExecuting(false);
    }
  };

  const downloadResults = () => {
    if (!result || !result.data) return;
    
    try {
      // Convert the data to CSV
      const headers = Object.keys(result.data[0]).join(',');
      const rows = result.data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );
      const csv = [headers, ...rows].join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `query_result_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
      a.click();
      
      toast.success('Resultados baixados como CSV');
    } catch (error) {
      console.error('Erro ao baixar resultados:', error);
      toast.error('Erro ao baixar resultados');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          Executor de Consultas SQL
        </CardTitle>
        <CardDescription>
          Execute consultas SQL diretamente no banco de dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="query" className="text-sm font-medium">
              Consulta SQL
            </label>
            <Badge variant="outline" className="text-xs">
              Apenas consultas SELECT são permitidas
            </Badge>
          </div>
          <Textarea 
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite sua consulta SQL aqui..."
            className="font-mono h-36"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={executeQuery}
            disabled={isExecuting || !query.trim()}
            className="flex-1"
          >
            <Play className="mr-2 h-4 w-4" />
            Executar Consulta
          </Button>
          
          {result && result.success && result.data && result.data.length > 0 && (
            <Button 
              variant="outline"
              onClick={downloadResults}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar CSV
            </Button>
          )}
        </div>
        
        {isExecuting && (
          <div className="flex items-center justify-center p-4">
            <Clock className="h-5 w-5 animate-spin mr-2" />
            <span>Executando consulta...</span>
          </div>
        )}
        
        {result && (
          <div className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant={result.success ? "default" : "destructive"}>
                {result.success ? "Sucesso" : "Erro"}
              </Badge>
              
              {result.success && (
                <>
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    {result.execution_time}s
                  </Badge>
                  
                  {result.row_count !== undefined && (
                    <Badge variant="outline">
                      <Table className="mr-1 h-3 w-3" />
                      {result.row_count} linhas
                    </Badge>
                  )}
                </>
              )}
            </div>
            
            {!result.success && (
              <div className="bg-destructive/10 p-3 rounded text-sm">
                <div className="font-medium text-destructive">{result.message}</div>
                {result.error_details && (
                  <div className="mt-1 text-muted-foreground">
                    Código: {result.error_details.code}, Linha: {result.error_details.line}
                  </div>
                )}
              </div>
            )}
            
            {result.success && result.data && result.data.length > 0 && (
              <div className="border rounded-md overflow-auto max-h-96">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      {Object.keys(result.data[0]).map((column, i) => (
                        <th key={i} className="px-4 py-2 text-left font-medium">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row, i) => (
                      <tr key={i} className="border-t">
                        {Object.values(row).map((value, j) => (
                          <td key={j} className="px-4 py-2">
                            {value !== null ? String(value) : <span className="text-muted-foreground italic">null</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {result.success && (!result.data || result.data.length === 0) && (
              <div className="bg-muted p-4 rounded text-center text-sm">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryExecutor;
