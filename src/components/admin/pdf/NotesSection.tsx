
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface NotesSectionProps {
  notes: string | null;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Observações</Text>
      <Text style={styles.text}>{notes}</Text>
    </View>
  );
};

export default NotesSection;
