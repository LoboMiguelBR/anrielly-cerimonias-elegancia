
import { Font } from '@react-pdf/renderer';

// Register fonts using more reliable sources
export const registerFonts = () => {
  // Playfair Display fonts (regular and bold)
  Font.register({
    family: 'Playfair Display',
    src: 'https://fonts.cdnfonts.com/s/16167/PlayfairDisplay-Regular.woff',
    fontWeight: 'normal',
  });

  Font.register({
    family: 'Playfair Display',
    src: 'https://fonts.cdnfonts.com/s/16167/PlayfairDisplay-Bold.woff',
    fontWeight: 'bold',
  });

  // Montserrat fonts (normal, italic, medium, bold)
  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.cdnfonts.com/s/15021/Montserrat-Regular.woff',
    fontWeight: 'normal',
  });

  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.cdnfonts.com/s/15021/Montserrat-Italic.woff',
    fontWeight: 'normal',
    fontStyle: 'italic',
  });

  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.cdnfonts.com/s/15021/Montserrat-Medium.woff',
    fontWeight: 'medium',
  });

  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.cdnfonts.com/s/15021/Montserrat-Bold.woff',
    fontWeight: 'bold',
  });
};
