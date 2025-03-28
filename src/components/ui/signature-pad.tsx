
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  disabled?: boolean;
  className?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ 
  onSave, 
  disabled = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Ensure component is mounted before accessing DOM
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      setIsMounted(false);
    };
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      if (!canvas || !ctx) return;
      
      const parentWidth = canvas.parentElement?.clientWidth || 300;
      canvas.width = parentWidth;
      canvas.height = 200;
      
      // Set canvas styles
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';
      
      // Clear the canvas
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    updateCanvasSize();
    
    const handleResize = () => {
      if (isMounted) {
        updateCanvasSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMounted]);
  
  const getCoordinates = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if (!isMounted) return null;
    
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  
  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !isMounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coordinates = getCoordinates(event.nativeEvent);
    
    if (!ctx || !coordinates) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    ctx.beginPath();
    ctx.moveTo(coordinates.x, coordinates.y);
  };
  
  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled || !isMounted) return;
    event.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coordinates = getCoordinates(event.nativeEvent);
    
    if (!ctx || !coordinates) return;
    
    ctx.lineTo(coordinates.x, coordinates.y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearSignature = () => {
    if (!isMounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };
  
  const saveSignature = () => {
    if (!hasSignature || !isMounted) {
      toast.error('Please provide a signature');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      const signatureData = canvas.toDataURL('image/png');
      onSave(signatureData);
    } catch (error) {
      toast.error('Failed to save signature');
    }
  };
  
  if (!isMounted) {
    return <div className="h-[200px] bg-muted animate-pulse rounded-md"></div>;
  }
  
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="border rounded-md overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex justify-between gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={clearSignature}
          disabled={disabled || !hasSignature}
          className="flex-1"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Clear
        </Button>
        
        <Button 
          type="button" 
          onClick={saveSignature}
          disabled={disabled || !hasSignature}
          className="flex-1"
        >
          Save Signature
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
