import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';
import {saveVoiceNote, getVoiceNotes} from '../services/StorageService';
import {VoiceNote} from '../types/VoiceNote';
import VoiceNoteItem from '../components/VoiceNoteItem';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordingScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState('');
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

  useEffect(() => {
    loadVoiceNotes();
  }, []);

  const loadVoiceNotes = async () => {
    const notes = await getVoiceNotes();
    setVoiceNotes(notes);
  };

  const checkPermissions = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    }

    return false;
  };

  const startRecording = async () => {
    const hasPermission = await checkPermissions();

    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required');
      return;
    }

    try {
      const timestamp = Date.now();
      const path = Platform.select({
        ios: `voiceNote_${timestamp}.m4a`,
        android: `sdcard/voiceNote_${timestamp}.mp4`,
      });

      const result = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener(() => {});

      setRecordingPath(result);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);

      const timestamp = Date.now();
      const newNote: VoiceNote = {
        id: timestamp.toString(),
        name: `Voice Note ${new Date(timestamp).toLocaleDateString()}`,
        path: result,
        date: new Date(timestamp).toISOString(),
        duration: 0,
      };

      await saveVoiceNote(newNote);
      await loadVoiceNotes();

      Alert.alert('Success', 'Recording saved');
      setRecordingPath('');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const renderVoiceNote = ({item}: {item: VoiceNote}) => {
    return (
      <VoiceNoteItem
        note={item}
        onPress={() => {
          Alert.alert('Voice Note', item.name);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Recorder</Text>
        <Text style={styles.status}>
          {isRecording ? 'Recording...' : 'Ready to Record'}
        </Text>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={handleRecordPress}>
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Voice Notes ({voiceNotes.length})</Text>
        <FlatList
          data={voiceNotes}
          renderItem={renderVoiceNote}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No voice notes yet</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  status: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonActive: {
    backgroundColor: '#f44336',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default RecordingScreen;
