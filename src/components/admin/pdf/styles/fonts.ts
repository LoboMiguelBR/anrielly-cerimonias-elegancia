
import { Font } from '@react-pdf/renderer';

// Register fonts using standard PDF fonts for maximum compatibility with @react-pdf/renderer
export const registerFonts = () => {
  // Standard PDF fonts don't need 'src' as they are built into PDF
  Font.registerHyphenationCallback(word => [word]);
  
  // Register standard PDF fonts
  Font.registerEmojiSource({
    format: 'png',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
  });
}
