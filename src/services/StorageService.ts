import AsyncStorage from '@react-native-async-storage/async-storage';
import {VoiceNote} from '../types/VoiceNote';

const STORAGE_KEY = 'voice_notes';

export const saveVoiceNote = async (note: VoiceNote): Promise<void> => {
  const existingNotes = await getVoiceNotes();
  const updatedNotes = [...existingNotes, note];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
};

export const getVoiceNotes = async (): Promise<VoiceNote[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const deleteVoiceNote = async (id: string): Promise<void> => {
  const existingNotes = await getVoiceNotes();
  const updatedNotes = existingNotes.filter(note => note.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
};

export const renameVoiceNote = async (
  id: string,
  newName: string,
): Promise<void> => {
  const existingNotes = await getVoiceNotes();
  const updatedNotes = existingNotes.map(note => {
    if (note.id === id) {
      return {...note, name: newName};
    }
    return note;
  });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
};

