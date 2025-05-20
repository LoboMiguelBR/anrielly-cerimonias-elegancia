
import { StyleSheet } from '@react-pdf/renderer';

// Cover page styles
export const coverPageStyles = StyleSheet.create({
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    height: '100%',
  },
  coverPageImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 40,
    border: '4px solid #D4AF37',
  },
  coverPageTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#7E69AB',
    textAlign: 'center',
  },
  coverPageSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
    textAlign: 'center',
  },
  coverPageClientName: {
    fontFamily: 'Playfair Display',
    fontSize: 20,
    marginTop: 30,
    color: '#D4AF37',
    textAlign: 'center',
  },
});
