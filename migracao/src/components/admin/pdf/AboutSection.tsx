
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { AboutSectionProps } from './types';

const AboutSection: React.FC<AboutSectionProps> = ({ colors }) => {
  return (
    <View style={styles.aboutSection}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman'
      }}>
        Sobre Anrielly Gomes
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica',
        marginBottom: 8
      }}>
        Com mais de 7 anos de experiência, Anrielly Gomes tem se destacado como uma das principais celebrantes e mestres de cerimônia no Brasil, conduzindo cerimônias memoráveis para casais que desejam uma celebração única e personalizada.
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        Cada cerimônia é cuidadosamente elaborada, respeitando as preferências, histórias e sonhos de cada casal, garantindo um momento emocionante e autêntico.
      </Text>
    </View>
  );
};

export default AboutSection;

// Fix the export for use in page components
export { AboutSection };
