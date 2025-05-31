
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const WebChat = () => {
  const location = useLocation();

  useEffect(() => {
    // Só carrega o WebChat se estiver na Landing Page
    if (location.pathname === '/') {
      // Verifica se o script já foi carregado
      if (!window.botpress) {
        // Carrega o script do Botpress dinamicamente
        const script = document.createElement('script');
        script.src = 'https://cdn.botpress.cloud/webchat/v2.5/inject.js';
        script.onload = () => {
          // Inicializa o WebChat após o script carregar
          if (window.botpress) {
            window.botpress.init({
              botId: "64bac240-6c5f-4d7e-a6ae-c1b8efa10305",
              clientId: "dfc5c6a0-dcc7-4dce-84bb-722114ea5d65",
              configuration: {
                composerPlaceholder: "Fale comigo sobre cerimônia, orçamento ou como posso te ajudar ❤️",
                botName: "Nini - Assistente Virtual -",
                botAvatar: "https://files.bpcontent.cloud/2025/05/29/02/20250529021439-7OPM0OZS.jpeg",
                botDescription: "- Mestre de Cerimônia - Anrielly Gomes",
                fabImage: "https://files.bpcontent.cloud/2025/05/29/02/20250529021725-AS2NWVAJ.png",
                color: "#ce22dd",
                variant: "solid",
                themeMode: "light",
                fontFamily: "inter",
                radius: 4
              }
            });
          }
        };
        document.head.appendChild(script);
      } else {
        // Se já existe, apenas mostra
        const webchatContainer = document.querySelector('[data-testid="webchat-container"]');
        if (webchatContainer) {
          (webchatContainer as HTMLElement).style.display = 'block';
        }
      }
    } else {
      // Se não está na Landing Page, esconde o WebChat
      const webchatContainer = document.querySelector('[data-testid="webchat-container"]');
      if (webchatContainer) {
        (webchatContainer as HTMLElement).style.display = 'none';
      }
    }
  }, [location.pathname]);

  // Cleanup quando o componente desmonta
  useEffect(() => {
    return () => {
      const webchatContainer = document.querySelector('[data-testid="webchat-container"]');
      if (webchatContainer && location.pathname !== '/') {
        (webchatContainer as HTMLElement).style.display = 'none';
      }
    };
  }, [location.pathname]);

  return null; // Este componente não renderiza nada visualmente
};

// Declaração de tipos para o window.botpress
declare global {
  interface Window {
    botpress: any;
  }
}

export default WebChat;
