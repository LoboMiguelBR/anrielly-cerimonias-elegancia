
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

const AboutSection: React.FC = () => {
  return (
    <View style={styles.aboutSection}>
      <Text style={styles.sectionTitle}>Sobre Anrielly Gomes</Text>
      <Text style={styles.text}>
        Sou Anrielly Gomes, apaixonada por transformar cerimônias em momentos únicos. 
        Com mais de 20 anos de experiência e uma trajetória em oratória e eventos, 
        levo emoção e leveza a cada celebração.
      </Text>
      <Text style={styles.text}>
        Minha missão é conduzir seu momento especial com profissionalismo e sensibilidade, 
        criando memórias inesquecíveis para você e seus convidados.
      </Text>
      <Text style={[styles.text, {fontStyle: 'italic', color: '#7E69AB', marginTop: 10}]}>
        "Cada cerimônia é única como a história de cada casal."
      </Text>
    </View>
  );
};

export default AboutSection;
