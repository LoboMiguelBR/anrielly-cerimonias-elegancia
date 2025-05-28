
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, PenTool } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
  hasDrawnSignature: boolean;
  onHasDrawnSignatureChange: (hasDrawn: boolean) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  hasDrawnSignature,
  onHasDrawnSignatureChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setLastPoint(pos);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPoint = getEventPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
    
    if (!hasDrawnSignature) {
      onHasDrawnSignatureChange(true);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setLastPoint(null);
    
    // Save signature as base64
    const canvas = canvasRef.current;
    if (canvas) {
      const signature = canvas.toDataURL();
      onSignatureChange(signature);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    onSignatureChange('');
    onHasDrawnSignatureChange(false);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PenTool className="h-4 w-4" />
            <span>Desenhe sua assinatura abaixo</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Limpar
          </Button>
        </div>
        
        <div className="border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
          <canvas
            ref={canvasRef}
            className="w-full h-32 md:h-40 cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        {!hasDrawnSignature && (
          <p className="text-xs text-gray-500 text-center">
            Clique e arraste ou toque e deslize para assinar
          </p>
        )}
      </div>
    </Card>
  );
};

export default SignatureCanvas;
