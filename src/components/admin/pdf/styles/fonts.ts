
import { Font } from '@react-pdf/renderer';

// Registrar fontes diretamente como arquivos estáticos em vez de URLs do Google Fonts
export const registerFonts = () => {
  // Montserrat
  Font.register({
    family: 'Montserrat',
    fonts: [
      { 
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-p7K4KLg.woff2',
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXZ0poK5.woff2',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aXp-p7K4KLg.woff2',
        fontWeight: 'medium',
      },
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXp-p7K4KLg.woff2',
        fontWeight: 'bold',
      },
    ],
  });

  // Playfair Display
  Font.register({
    family: 'Playfair Display',
    fonts: [
      { 
        src: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDZbtXK-F2qC0s.woff2',
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiu82b8g.woff2',
        fontWeight: 'bold',
      },
    ],
  });
  
  // Registrar fontes de fallback que são garantidas de funcionar
  Font.register({
    family: 'Fallback',
    src: 'https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2',
  });
  
  // Registrar callback de hifenização para melhorar a renderização do texto
  Font.registerHyphenationCallback(word => [word]);
};
