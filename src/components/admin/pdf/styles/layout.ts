
import { StyleSheet } from '@react-pdf/renderer';

// Basic layout styles
export const layoutStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica', // Changed from Montserrat
    color: '#333',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  headerRight: {
    textAlign: 'right',
    fontSize: 10,
    fontFamily: 'Helvetica', // Added fontFamily
  },
  section: {
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6FA',
    borderBottomStyle: 'solid',
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderTopStyle: 'solid',
    fontSize: 9,
    color: '#666',
    fontFamily: 'Helvetica', // Added fontFamily
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#666',
    fontFamily: 'Helvetica', // Added fontFamily
  },
  contactInfoFooter: {
    fontSize: 9,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Helvetica', // Added fontFamily
  },
});
