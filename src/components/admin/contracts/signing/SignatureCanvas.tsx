
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, PenTool, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { saveSignatureToStorage } from '@/utils/storage/signatureStorage';

interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
  onSignatureUrlChange: (url: string) => void;
  hasDrawnSignature: boolean;
  onHasDrawnSignatureChange: (hasDrawn: boolean) => void;
  contractId?: string;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  onSignatureUrlChange,
  hasDrawnSignature,
  onHasDrawnSignatureChange,
  contractId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [savedSignatureUrl, setSavedSignatureUrl] = useState<string>('');

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
    
    // Reset saved state when user starts drawing again
    if (signatureSaved) {
      setSignatureSaved(false);
      setSavedSignatureUrl('');
    }
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
    setSignatureSaved(false);
    setSavedSignatureUrl('');
    onSignatureUrlChange('');
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawnSignature) {
      toast.error('Desenhe uma assinatura primeiro');
      return;
    }

    setIsSaving(true);
    try {
      const signature = canvas.toDataURL();
      const url = await saveSignatureToStorage(signature, contractId);
      
      setSavedSignatureUrl(url);
      setSignatureSaved(true);
      onSignatureUrlChange(url);
      
      toast.success('Assinatura salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
      toast.error('Erro ao salvar assinatura');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PenTool className="h-4 w-4" />
            <span>Desenhe sua assinatura abaixo</span>
          </div>
          <div className="flex gap-2">
            {hasDrawnSignature && !signatureSaved && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={saveSignature}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Assinatura
                  </>
                )}
              </Button>
            )}
            
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
        
        {signatureSaved && savedSignatureUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Assinatura salva com sucesso!</span>
            </div>
            <div className="flex items-center justify-center bg-white border rounded p-2">
              <img 
                src={savedSignatureUrl} 
                alt="Assinatura salva" 
                className="max-h-16 max-w-full object-contain"
                onError={() => {
                  console.error('Erro ao carregar preview da assinatura salva');
                }}
              />
            </div>
          </div>
        )}
        
        {!hasDrawnSignature && !signatureSaved && (
          <p className="text-xs text-gray-500 text-center">
            Clique e arraste ou toque e deslize para assinar
          </p>
        )}
      </div>
    </Card>
  );
};

export default SignatureCanvas;
