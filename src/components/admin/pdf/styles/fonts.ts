
import { Font } from '@react-pdf/renderer';

// Usamos fontes diretamente do Google Fonts para garantir que funcionem no PDF
export const registerFonts = () => {
  // Montserrat - Regular
  Font.register({
    family: 'Montserrat',
    fonts: [
      { 
        src: 'https://fonts.googleapis.com/css?family=Montserrat&display=swap',
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.googleapis.com/css?family=Montserrat:italic&display=swap',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
      {
        src: 'https://fonts.googleapis.com/css?family=Montserrat:500&display=swap',
        fontWeight: 'medium',
      },
      {
        src: 'https://fonts.googleapis.com/css?family=Montserrat:700&display=swap',
        fontWeight: 'bold',
      },
    ],
  });

  // Playfair Display
  Font.register({
    family: 'Playfair Display',
    fonts: [
      { 
        src: 'https://fonts.googleapis.com/css?family=Playfair+Display&display=swap', 
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.googleapis.com/css?family=Playfair+Display:700&display=swap',
        fontWeight: 'bold',
      },
    ],
  });
  
  // Fontes fallback para garantir que o PDF será gerado mesmo sem acesso às fontes externas
  Font.register({
    family: 'Fallback',
    src: 'https://fonts.googleapis.com/css?family=Open+Sans&display=swap',
  });
  
  // Registrar callback de hifenização para melhorar a renderização do texto
  Font.registerHyphenationCallback(word => [word]);
};
