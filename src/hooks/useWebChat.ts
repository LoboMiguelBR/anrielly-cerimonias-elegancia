
import { useState, useEffect } from 'react';
import { useMobileLayout } from './useMobileLayout';

interface WebChatState {
  isLoaded: boolean;
  isOpen: boolean;
  hasConflict: boolean;
}

export const useWebChat = () => {
  const { isMobile } = useMobileLayout();
  const [state, setState] = useState<WebChatState>({
    isLoaded: false,
    isOpen: false,
    hasConflict: false
  });

  useEffect(() => {
    // Detectar quando o Botpress está carregado
    const checkBotpress = () => {
      if (window.botpress) {
        setState(prev => ({ ...prev, isLoaded: true }));
        
        // Aplicar estilos apenas no mobile
        if (isMobile) {
          // Ocultar completamente o botão padrão do Botpress no mobile
          const style = document.createElement('style');
          style.id = 'mobile-webchat-styles';
          style.textContent = `
            .bpw-floating-button {
              display: none !important;
            }
            .bpw-widget {
              z-index: 9998 !important;
            }
          `;
          document.head.appendChild(style);
        } else {
          // Remover estilos se existirem (para quando muda de mobile para desktop)
          const existingStyle = document.getElementById('mobile-webchat-styles');
          if (existingStyle) {
            existingStyle.remove();
          }
        }

        return true;
      }
      return false;
    };

    // Verificar imediatamente
    if (!checkBotpress()) {
      // Se não estiver carregado, verificar periodicamente
      const interval = setInterval(() => {
        if (checkBotpress()) {
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    } else {
      // Se já estiver carregado, aplicar estilos baseado no layout atual
      checkBotpress();
    }
  }, [isMobile]);

  const openChat = () => {
    if (window.botpress && window.botpress.open) {
      window.botpress.open();
      setState(prev => ({ ...prev, isOpen: true }));
    }
  };

  const closeChat = () => {
    if (window.botpress && window.botpress.close) {
      window.botpress.close();
      setState(prev => ({ ...prev, isOpen: false }));
    }
  };

  return {
    ...state,
    openChat,
    closeChat
  };
};
