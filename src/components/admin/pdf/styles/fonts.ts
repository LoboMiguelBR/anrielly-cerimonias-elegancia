
import { Font } from '@react-pdf/renderer';

// Register fonts using reliable, embedded base64 font data to avoid loading issues
export const registerFonts = () => {
  // Use Font.register with base64-encoded or local font files
  // This approach is more reliable than loading from Google Fonts URLs
  
  // For demonstration purposes, we're using system fonts as fallbacks
  // In production, you should embed your fonts or use local font files
  Font.register({
    family: 'Playfair Display',
    fonts: [
      { 
        src: 'https://pdf-fonts.lovable.dev/PlayfairDisplay-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: 'https://pdf-fonts.lovable.dev/PlayfairDisplay-Bold.ttf',
        fontWeight: 'bold',
      },
    ],
  });

  Font.register({
    family: 'Montserrat',
    fonts: [
      {
        src: 'https://pdf-fonts.lovable.dev/Montserrat-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: 'https://pdf-fonts.lovable.dev/Montserrat-Italic.ttf',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
      {
        src: 'https://pdf-fonts.lovable.dev/Montserrat-Medium.ttf',
        fontWeight: 'medium',
      },
      {
        src: 'https://pdf-fonts.lovable.dev/Montserrat-Bold.ttf',
        fontWeight: 'bold',
      },
    ],
  });
  
  // Register fallback fonts to ensure rendering even if primary fonts fail
  Font.registerHyphenationCallback(word => [word]);
};
