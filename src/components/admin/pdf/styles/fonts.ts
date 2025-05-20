
import { Font } from '@react-pdf/renderer';

// Usamos fonte embutida em Base64 para garantir que funcionem no PDF
export const registerFonts = () => {
  // Montserrat - Regular
  Font.register({
    family: 'Montserrat',
    fonts: [
      { 
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-p7K4KLg.ttf',
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw7aXp-p7K4KLg.ttf',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXp-p7K4KLg.ttf',
        fontWeight: 'medium',
      },
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w7aXp-p7K4KLg.ttf',
        fontWeight: 'bold',
      },
    ],
  });

  // Playfair Display
  Font.register({
    family: 'Playfair Display',
    fonts: [
      { 
        src: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtPK-F2qC0s.ttf', 
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiu7XbtPK-F2qC0s.ttf',
        fontWeight: 'bold',
      },
    ],
  });
  
  // Registrar callback de hifenização para melhorar a renderização do texto
  Font.registerHyphenationCallback(word => [word]);
};
