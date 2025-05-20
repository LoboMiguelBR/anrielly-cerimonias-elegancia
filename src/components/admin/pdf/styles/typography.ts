
import { StyleSheet } from '@react-pdf/renderer';

// Typography styles
export const typographyStyles = StyleSheet.create({
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1F2C',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Playfair Display',
    fontSize: 16,
    marginBottom: 5,
    color: '#7E69AB',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Playfair Display',
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#E6E6FA',
    borderLeft: '4px solid #9b87f5',
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  textBold: {
    fontWeight: 'bold',
  },
  signature: {
    marginTop: 50,
    borderTop: '1px solid #999',
    width: '60%',
    marginHorizontal: 'auto',
    paddingTop: 5,
    textAlign: 'center',
    fontSize: 10,
  },
});
