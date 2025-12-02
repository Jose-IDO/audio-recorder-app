import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {VoiceNote} from '../types/VoiceNote';

interface VoiceNoteItemProps {
  note: VoiceNote;
  onPress: () => void;
}

const VoiceNoteItem: React.FC<VoiceNoteItemProps> = ({note, onPress}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{note.name}</Text>
        <Text style={styles.date}>{formatDate(note.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  content: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});

export default VoiceNoteItem;

