
import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQZNLo_U2r.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew-Y3tcoqK5.ttf',
  fontWeight: 'medium',
});

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf',
  fontWeight: 'bold',
});

// Estilos para o PDF
export const styles = StyleSheet.create({
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
  section: {
    marginBottom: 20,
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
  clientInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  textBold: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  serviceItem: {
    marginBottom: 8,
    fontSize: 11,
    flexDirection: 'row',
  },
  dot: {
    marginRight: 5,
    color: '#9b87f5',
  },
  priceSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    borderTop: '2px solid #D4AF37',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7E69AB',
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
  divider: {
    borderBottom: '1px solid #E6E6FA',
    marginVertical: 10,
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
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#666',
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
    borderLeft: '3px solid #D4AF37',
  },
  testimonialQuote: {
    fontStyle: 'italic',
    fontSize: 11,
    marginBottom: 5,
  },
  testimonialAuthor: {
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'right',
  },
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
  contactInfoFooter: {
    fontSize: 9,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
});
