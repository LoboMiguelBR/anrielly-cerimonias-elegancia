
import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';

interface CoverPageProps {
  clientName: string;
  eventType: string;
  eventDate: string;
  totalPrice: number;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

const defaultColors = {
  primary: '#8A2BE2', // Purple
  secondary: '#F2AE30', // Gold
  accent: '#E57373',
  text: '#333333',
  background: '#FFFFFF'
};

const CoverPage: React.FC<CoverPageProps> = ({ 
  clientName, 
  eventType, 
  eventDate, 
  totalPrice,
  colors = defaultColors
}) => {
  // Supabase image URL for logo
  const logoUrl = "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/public-assets/LogoAG.png";
  
  // Create a fallback for the background image (won't show in the PDF but prevents errors)
  const backgroundImageUrl = ""; // We'll handle this differently with a low opacity background
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: colors.background,
      padding: 0,
      position: 'relative'
    },
    coverImg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.05 // Very low opacity as fallback
    },
    container: {
      position: 'relative', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%', // This is fine as it's a special case in react-pdf
      padding: 30,
      zIndex: 10
    },
    header: {
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.primary,
      textAlign: 'center',
      fontFamily: 'Times-Roman' // Changed from Times-Roman
    },
    subheader: {
      fontSize: 24,
      marginBottom: 10,
      color: colors.secondary,
      textAlign: 'center',
      fontFamily: 'Times-Roman' // Changed from Times-Roman
    },
    clientInfo: {
      marginTop: 60,
      marginBottom: 40,
      padding: 20,
      width: 400, // Fixed width instead of percentage
      borderWidth: 1,
      borderColor: colors.secondary,
      borderStyle: 'solid',
      borderRadius: 4,
      backgroundColor: colors.background,
      alignSelf: 'center'
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    label: {
      fontWeight: 'bold',
      width: 120, // Fixed width instead of percentage
      color: colors.primary,
      fontFamily: 'Helvetica-Bold' // Added specific font
    },
    value: {
      width: 180, // Fixed width instead of percentage
      color: colors.text,
      fontFamily: 'Helvetica' // Added fontFamily
    },
    price: {
      fontSize: 18,
      color: colors.primary,
      marginTop: 10,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Helvetica-Bold' // Added specific font
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 30,
      alignSelf: 'center'
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: colors.text,
      fontSize: 10,
      fontFamily: 'Helvetica' // Added fontFamily
    }
  });

  return (
    <View style={styles.page}>
      {/* Background with low opacity - no actual image */}
      <View style={styles.coverImg} />
      
      <View style={styles.container}>
        {/* Logo */}
        <Image 
          src={logoUrl} 
          style={styles.logo} 
        />
        
        {/* Title */}
        <Text style={styles.header}>Proposta Fotográfica</Text>
        <Text style={styles.subheader}>{eventType}</Text>
        
        {/* Client Info Box */}
        <View style={styles.clientInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{clientName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data do Evento:</Text>
            <Text style={styles.value}>{eventDate}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo de Evento:</Text>
            <Text style={styles.value}>{eventType}</Text>
          </View>
          
          <Text style={styles.price}>
            R$ {formatCurrency(totalPrice)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.footer}>
        Anrielly Gomes Fotografia - www.anriellygomes.com.br
      </Text>
    </View>
  );
};

export default CoverPage;
