
import { StyleSheet } from '@react-pdf/renderer';

// Typography styles
export const typographyStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1F2C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#7E69AB',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#E6E6FA',
    borderLeftWidth: 4,
    borderLeftColor: '#9b87f5',
    borderLeftStyle: 'solid',
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
    borderTopWidth: 1,
    borderTopColor: '#999',
    borderTopStyle: 'solid',
    width: 250,
    marginHorizontal: 'auto',
    paddingTop: 5,
    textAlign: 'center',
    fontSize: 10,
  },
});
