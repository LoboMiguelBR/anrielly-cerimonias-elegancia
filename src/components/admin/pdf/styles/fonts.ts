
import { Font } from '@react-pdf/renderer';

// Register fonts using local font files to avoid loading issues
export const registerFonts = () => {
  // Playfair Display fonts (regular and bold)
  Font.register({
    family: 'Playfair Display',
    fonts: [
      { 
        src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2',
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTPYgEM86xQ.woff2',
        fontWeight: 'bold',
      },
    ],
  });

  // Montserrat fonts (normal, italic, medium, bold)
  Font.register({
    family: 'Montserrat',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-p7K4KLg.woff2',
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXh0ppC8MLnbtg.woff2',
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
};
