import AsyncStorage from '@react-native-async-storage/async-storage';
import {VoiceNote} from '../types/VoiceNote';

const STORAGE_KEY = 'voice_notes';

export const saveVoiceNote = async (note: VoiceNote): Promise<void> => {
  try {
    const existingNotes = await getVoiceNotes();
    const updatedNotes = [...existingNotes, note];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    throw new Error('Failed to save voice note');
  }
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
  try {
    const existingNotes = await getVoiceNotes();
    const updatedNotes = existingNotes.filter(note => note.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    throw new Error('Failed to delete voice note');
  }
};

