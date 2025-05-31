
import { useState, useEffect } from 'react';

interface WebChatState {
  isLoaded: boolean;
  isOpen: boolean;
  hasConflict: boolean;
}

export const useWebChat = () => {
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
        
        // Ocultar o botão padrão do Botpress
        const style = document.createElement('style');
        style.textContent = `
          .bpw-floating-button {
            display: none !important;
          }
          .bpw-widget {
            z-index: 9998 !important;
          }
        `;
        document.head.appendChild(style);

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
    }
  }, []);

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
