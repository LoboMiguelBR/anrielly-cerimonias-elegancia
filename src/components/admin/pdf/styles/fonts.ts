
import { Font } from '@react-pdf/renderer';

// Register fonts using standard PDF fonts for maximum compatibility with @react-pdf/renderer
export const registerFonts = () => {
  // Use standard PDF fonts instead of Montserrat for better compatibility
  Font.register({
    family: 'Montserrat',
    fonts: [
      {
        src: undefined,
        fontWeight: 'normal',
      }
    ],
  });

  // Register Playfair Display as Times-Roman for better compatibility
  Font.register({
    family: 'Playfair Display', 
    fonts: [
      { 
        src: undefined,
        fontWeight: 'normal',
      }
    ],
  });
  
  // Register standard fonts - these are natively supported by PDF
  Font.register({
    family: 'Helvetica',
    fonts: [
      { src: undefined, fontWeight: 'normal' },
      { src: undefined, fontWeight: 'bold' },
      { src: undefined, fontStyle: 'italic' },
      { src: undefined, fontWeight: 'bold', fontStyle: 'italic' }
    ]
  });

  Font.register({
    family: 'Times-Roman',
    fonts: [
      { src: undefined, fontWeight: 'normal' },
      { src: undefined, fontWeight: 'bold' },
      { src: undefined, fontStyle: 'italic' },
      { src: undefined, fontWeight: 'bold', fontStyle: 'italic' }
    ]
  });

  // Register callback for hyphenation (very helpful for text-justify in PDFs)
  Font.registerHyphenationCallback(word => [word]);
}
