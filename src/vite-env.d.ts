
/// <reference types="vite/client" />

declare global {
  interface Window {
    botpress?: {
      init: (config: any) => void;
      open: () => void;
      close: () => void;
      destroy: () => void;
    };
  }
}

export {};
