
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { useWebChat } from '@/hooks/useWebChat';

interface Position {
  x: number;
  y: number;
}

const FloatingWebChat: React.FC = () => {
  const { isMobile } = useMobileLayout();
  const { openChat } = useWebChat();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);

  // Configuração inicial da posição
  const getInitialPosition = useCallback((): Position => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonSize = 60;
    const margin = 20;

    // Carregar posição salva ou usar padrão
    const savedPosition = localStorage.getItem('webchat-position');
    if (savedPosition) {
      const parsed = JSON.parse(savedPosition);
      // Validar se a posição ainda é válida na viewport atual
      if (
        parsed.x >= 0 && 
        parsed.x <= viewportWidth - buttonSize &&
        parsed.y >= 0 && 
        parsed.y <= viewportHeight - buttonSize - 100
      ) {
        return parsed;
      }
    }

    // Posição padrão: canto inferior direito, evitando footer
    return {
      x: viewportWidth - buttonSize - margin,
      y: viewportHeight - buttonSize - (isMobile ? 120 : 80)
    };
  }, [isMobile]);

  // Detectar conflitos com elementos da UI
  const detectConflicts = useCallback((pos: Position): Position => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonSize = 60;
    const margin = 20;

    let newPos = { ...pos };

    // Limites da viewport
    newPos.x = Math.max(margin, Math.min(viewportWidth - buttonSize - margin, newPos.x));
    newPos.y = Math.max(margin, Math.min(viewportHeight - buttonSize - margin, newPos.y));

    // Detectar conflito com footer
    const footerHeight = isMobile ? 100 : 80;
    if (newPos.y > viewportHeight - buttonSize - footerHeight) {
      newPos.y = viewportHeight - buttonSize - footerHeight;
    }

    return newPos;
  }, [isMobile]);

  // Inicializar posição apenas no mobile
  useEffect(() => {
    if (isMobile) {
      const initialPos = getInitialPosition();
      const safePos = detectConflicts(initialPos);
      setPosition(safePos);
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
    }
  }, [isMobile, getInitialPosition, detectConflicts]);

  // Lidar com redimensionamento da janela
  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      setPosition(prevPos => detectConflicts(prevPos));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [detectConflicts, isMobile]);

  // Eventos de mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatRef.current || !isMobile) return;
    
    const rect = chatRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !isMobile) return;

    const newPos = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    };

    setPosition(detectConflicts(newPos));
  }, [isDragging, detectConflicts, isMobile]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && isMobile) {
      setIsDragging(false);
      localStorage.setItem('webchat-position', JSON.stringify(position));
    }
  }, [isDragging, position, isMobile]);

  // Eventos de touch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!chatRef.current || !isMobile) return;
    
    const touch = e.touches[0];
    const rect = chatRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    setIsDragging(true);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !isMobile) return;
    e.preventDefault();

    const touch = e.touches[0];
    const newPos = {
      x: touch.clientX - dragOffset.current.x,
      y: touch.clientY - dragOffset.current.y
    };

    setPosition(detectConflicts(newPos));
  }, [isDragging, detectConflicts, isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging && isMobile) {
      setIsDragging(false);
      localStorage.setItem('webchat-position', JSON.stringify(position));
    }
  }, [isDragging, position, isMobile]);

  // Adicionar event listeners globais
  useEffect(() => {
    if (isDragging && isMobile) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd, isMobile]);

  // Renderizar apenas no mobile
  if (!isMobile || !isInitialized) return null;

  return (
    <div
      ref={chatRef}
      className={`fixed z-[9999] cursor-move select-none transition-all duration-200 ${
        isDragging ? 'scale-110 shadow-2xl' : 'shadow-lg hover:shadow-xl'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '60px',
        height: '60px',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div 
        className="w-full h-full bg-[#ce22dd] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#b01dc7] transition-colors"
        style={{
          backgroundImage: 'url(https://files.bpcontent.cloud/2025/05/29/02/20250529021725-AS2NWVAJ.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => {
          if (!isDragging) {
            openChat();
          }
        }}
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#ce22dd] font-bold text-lg">💬</span>
        </div>
      </div>
      
      {isDragging && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Arraste para mover
        </div>
      )}
    </div>
  );
};

export default FloatingWebChat;
