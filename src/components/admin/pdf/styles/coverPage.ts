
import { StyleSheet } from '@react-pdf/renderer';

// Cover page styles
export const coverPageStyles = StyleSheet.create({
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    height: '100%', // This is a special case that's supported
  },
  coverPageImage: {
    width: 200,
    height: 200,
    borderRadius: 100, // Changed from '100%' to numeric value
    marginBottom: 40,
    borderWidth: 4,
    borderColor: '#D4AF37',
    borderStyle: 'solid',
  },
  coverPageTitle: {
    fontFamily: 'Times-Roman', // Changed from Playfair Display
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#7E69AB',
    textAlign: 'center',
  },
  coverPageSubtitle: {
    fontFamily: 'Helvetica', // Changed from Montserrat
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
    textAlign: 'center',
  },
  coverPageClientName: {
    fontFamily: 'Times-Roman', // Changed from Playfair Display
    fontSize: 20,
    marginTop: 30,
    color: '#D4AF37',
    textAlign: 'center',
  },
});
