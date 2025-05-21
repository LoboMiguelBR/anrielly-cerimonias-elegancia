
import { StyleSheet } from '@react-pdf/renderer';

// Styles for various sections
export const sectionStyles = StyleSheet.create({
  clientInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  serviceItem: {
    marginBottom: 8,
    fontSize: 11,
    flexDirection: 'row',
  },
  dot: {
    marginRight: 5,
    color: '#9b87f5',
    fontFamily: 'Helvetica', // Added fontFamily
  },
  priceSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
    borderTopStyle: 'solid',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7E69AB',
    fontFamily: 'Helvetica-Bold', // Added fontFamily
  },
  aboutSection: {
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 5,
    marginBottom: 20,
  },
  testimonialSection: {
    padding: 10,
    backgroundColor: '#f0f0f8',
    borderRadius: 5,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
    borderLeftStyle: 'solid',
  },
  testimonialQuote: {
    fontStyle: 'italic',
    fontSize: 11,
    marginBottom: 5,
    fontFamily: 'Helvetica-Oblique', // Changed to supported font style
  },
  testimonialAuthor: {
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold', // Added fontFamily
  },
});
