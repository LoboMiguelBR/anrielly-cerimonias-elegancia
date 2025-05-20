
import { StyleSheet } from '@react-pdf/renderer';
import { registerFonts } from './fonts';
import { layoutStyles } from './layout';
import { typographyStyles } from './typography';
import { coverPageStyles } from './coverPage';
import { sectionStyles } from './sections';
import { featureStyles } from './features';

// Register fonts
registerFonts();

// Export the combined styles
export const styles = {
  ...layoutStyles,
  ...typographyStyles,
  ...coverPageStyles,
  ...sectionStyles,
  ...featureStyles,
};
