
import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
  hasDrawnSignature: boolean;
  onHasDrawnSignatureChange: (hasDrawn: boolean) => void;
}

const SignatureCanvas = ({ 
  onSignatureChange, 
  hasDrawnSignature, 
  onHasDrawnSignatureChange 
}: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // Configurar canvas para assinatura com melhor responsividade
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Configurar canvas com alta resolução
        const rect = canvas.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;
        
        ctx.scale(scale, scale);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Melhorar configurações para assinatura mais sensível
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.imageSmoothingEnabled = true;
      }
    }
  }, []);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scale,
        y: (touch.clientY - rect.top) * scale
      };
    } else {
      // Mouse event
      return {
        x: (e.clientX - rect.left) * scale,
        y: (e.clientY - rect.top) * scale
      };
    }
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setLastPoint(pos);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    onHasDrawnSignatureChange(true);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getEventPos(e);
    
    // Usar quadratic curve para suavizar a linha
    const midPoint = {
      x: (lastPoint.x + pos.x) / 2,
      y: (lastPoint.y + pos.y) / 2
    };
    
    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
    ctx.stroke();
    
    setLastPoint(pos);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    setLastPoint(null);
    
    const canvas = canvasRef.current;
    if (canvas) {
      onSignatureChange(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const scale = window.devicePixelRatio || 1;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);
    onSignatureChange('');
    onHasDrawnSignatureChange(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <span className="text-red-500">*</span>
        Assinatura Digital (obrigatória - desenhe no campo abaixo):
      </label>
      
      {!hasDrawnSignature && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Assinatura obrigatória:</strong> Por favor, desenhe sua assinatura no campo abaixo. 
            A assinatura desenhada é obrigatória para conferir validade jurídica ao contrato digital.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-gray-300 rounded bg-white touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-40 cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={clearSignature}
        >
          Limpar Assinatura
        </Button>
        <span className="text-xs text-gray-500 flex items-center">
          A assinatura será registrada com timestamp e IP para validade jurídica
        </span>
      </div>
    </div>
  );
};

export default SignatureCanvas;
