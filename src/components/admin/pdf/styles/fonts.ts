
import { Font } from '@react-pdf/renderer';

// Register fonts using standard PDF fonts for maximum compatibility with @react-pdf/renderer
export const registerFonts = () => {
  // Register standard fonts - these are natively supported by PDF
  // We don't set "src" for standard fonts as they're built-in to PDF spec
  Font.register({
    family: 'Helvetica',
    fonts: [
      { fontWeight: 'normal' },
      { fontWeight: 'bold' },
      { fontStyle: 'italic' },
      { fontWeight: 'bold', fontStyle: 'italic' }
    ]
  });

  Font.register({
    family: 'Times-Roman',
    fonts: [
      { fontWeight: 'normal' },
      { fontWeight: 'bold' },
      { fontStyle: 'italic' },
      { fontWeight: 'bold', fontStyle: 'italic' }
    ]
  });

  Font.register({
    family: 'Courier',
    fonts: [
      { fontWeight: 'normal' },
      { fontWeight: 'bold' },
      { fontStyle: 'italic' },
      { fontWeight: 'bold', fontStyle: 'italic' }
    ]
  });

  // Register callback for hyphenation (very helpful for text-justify in PDFs)
  Font.registerHyphenationCallback(word => [word]);
}
