
import { Font } from '@react-pdf/renderer';

// Register fonts using more reliable sources
export const registerFonts = () => {
  // Playfair Display fonts (regular and bold)
  Font.register({
    family: 'Playfair Display',
    src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.ttf',
    fontWeight: 'normal',
  });

  Font.register({
    family: 'Playfair Display',
    src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQZNLo_U2r.ttf',
    fontWeight: 'bold',
  });

  // Montserrat fonts (normal, italic, medium, bold)
  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf',
    fontWeight: 'normal',
  });

  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp8qA.ttf',
    fontWeight: 'normal',
    fontStyle: 'italic',
  });

  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew-Y3tcoqK5.ttf',
    fontWeight: 'medium',
  });

  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf',
    fontWeight: 'bold',
  });
};
