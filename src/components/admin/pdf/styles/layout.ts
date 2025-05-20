
import { StyleSheet } from '@react-pdf/renderer';

// Basic layout styles
export const layoutStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Montserrat',
    color: '#333',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #D4AF37',
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
  },
  section: {
    marginBottom: 20,
  },
  divider: {
    borderBottom: '1px solid #E6E6FA',
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 10,
    borderTop: '1px solid #ccc',
    fontSize: 9,
    color: '#666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#666',
  },
  contactInfoFooter: {
    fontSize: 9,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
});
