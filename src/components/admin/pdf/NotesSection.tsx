
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { NotesSectionProps } from './types';

const NotesSection: React.FC<NotesSectionProps> = ({ notes, colors }) => {
  if (!notes) return null;
  
  return (
    <View style={styles.section}>
      <Text style={{...styles.sectionTitle, color: colors.primary}}>Observações</Text>
      <Text style={{...styles.text, color: colors.text}}>{notes}</Text>
    </View>
  );
};

export default NotesSection;
