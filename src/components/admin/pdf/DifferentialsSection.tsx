
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { GenericSectionProps } from './types';

const DifferentialsSection: React.FC<GenericSectionProps> = ({ colors }) => {
  const differentials = [
    "Roteiro personalizado para cada cerimônia, refletindo a história e valores do casal.",
    "Oratória refinada e cuidadosamente preparada para emocionar os convidados.",
    "Coordenação completa com todos os fornecedores para um evento sem preocupações.",
    "Atenção aos detalhes e flexibilidade para se adaptar a imprevistos."
  ];

  return (
    <View style={styles.differentialsSection}>
      <Text style={{...styles.sectionTitle, color: colors.primary}}>Diferenciais</Text>
      
      {differentials.map((differential, index) => (
        <View key={index} style={styles.differentialItem}>
          <Text style={{...styles.differentialNumber, backgroundColor: colors.primary}}>{index+1}</Text>
          <Text style={{...styles.differentialText, color: colors.text}}>{differential}</Text>
        </View>
      ))}
    </View>
  );
};

export default DifferentialsSection;
