
import { StyleSheet } from '@react-pdf/renderer';

// Export feature-specific styles for the PDF
export const featureStyles = StyleSheet.create({
  // QR Code styles
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  qrCodeBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 5,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 70,
    height: 70,
  },
  qrCodeText: {
    fontSize: 10,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Helvetica', // Added fontFamily
  },
  qrCodeUrl: {
    fontSize: 8,
    marginTop: 5,
    color: '#666',
    fontFamily: 'Helvetica', // Added fontFamily
  },
  
  // Differentials section styles
  differentialsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  differentialItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  differentialNumber: {
    width: 22,
    height: 22,
    borderRadius: 11, // Changed from '50%' to 11 (half of width/height)
    backgroundColor: '#7E69AB',
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 1.4,
    marginRight: 8,
    paddingTop: 2,
    fontFamily: 'Helvetica', // Added fontFamily
  },
  differentialText: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Helvetica', // Added fontFamily
  },
  
  // Testimonial styles
  testimonialSection: {
    marginTop: 12,
    marginBottom: 12,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#7E69AB',
    borderLeftStyle: 'solid',
  },
  testimonialQuote: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 6,
    fontFamily: 'Helvetica-Oblique', // Changed to supported font style
  },
  testimonialAuthor: {
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold', // Added fontFamily
  }
});
