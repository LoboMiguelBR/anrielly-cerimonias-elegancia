
import { StyleSheet } from '@react-pdf/renderer';

// Styles for specific features
export const featureStyles = StyleSheet.create({
  differentialsSection: {
    marginBottom: 20,
  },
  differentialItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  differentialNumber: {
    backgroundColor: '#D4AF37',
    color: 'white',
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    fontSize: 10,
    marginRight: 8,
    fontWeight: 'bold',
    lineHeight: 1.8,
  },
  differentialText: {
    flex: 1,
    fontSize: 11,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  qrCodeText: {
    fontSize: 9,
    marginTop: 5,
    textAlign: 'center',
    color: '#666',
  },
});
