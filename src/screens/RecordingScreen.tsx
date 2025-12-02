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
import {
  saveVoiceNote,
  getVoiceNotes,
  deleteVoiceNote,
} from '../services/StorageService';
import {VoiceNote} from '../types/VoiceNote';
import VoiceNoteItem from '../components/VoiceNoteItem';
import PlaybackControls from '../components/PlaybackControls';
import SearchBar from '../components/SearchBar';
import SettingsButton from '../components/SettingsButton';
import SettingsScreen from './SettingsScreen';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordingScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState('');
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<VoiceNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    loadVoiceNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(voiceNotes);
    } else {
      const filtered = voiceNotes.filter(note =>
        note.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, voiceNotes]);

  useEffect(() => {
    if (isPlaying) {
      audioRecorderPlayer.addPlayBackListener(e => {
        const minutes = Math.floor(e.currentPosition / 1000 / 60);
        const seconds = Math.floor((e.currentPosition / 1000) % 60);
        setCurrentPosition(
          `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`,
        );

        const totalMinutes = Math.floor(e.duration / 1000 / 60);
        const totalSeconds = Math.floor((e.duration / 1000) % 60);
        setDuration(
          `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds
            .toString()
            .padStart(2, '0')}`,
        );

        if (e.currentPosition === e.duration) {
          stopPlayback();
        }
      });
    }

    return () => {
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [isPlaying]);

  const loadVoiceNotes = async () => {
    const notes = await getVoiceNotes();
    const sortedNotes = notes.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setVoiceNotes(sortedNotes);
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
    if (isPlaying) {
      stopPlayback();
    }

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

  const playVoiceNote = async (note: VoiceNote) => {
    if (isPlaying && currentPlayingId === note.id) {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
      return;
    }

    if (isPlaying) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    }

    try {
      const msg = await audioRecorderPlayer.startPlayer(note.path);
      audioRecorderPlayer.setVolume(1.0);
      setIsPlaying(true);
      setCurrentPlayingId(note.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const stopPlayback = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setCurrentPlayingId(null);
      setCurrentPosition('00:00');
      setDuration('00:00');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop playback');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (currentPlayingId === id && isPlaying) {
      await stopPlayback();
    }

    try {
      await deleteVoiceNote(id);
      await loadVoiceNotes();
      Alert.alert('Success', 'Voice note deleted');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete voice note');
    }
  };

  const renderVoiceNote = ({item}: {item: VoiceNote}) => {
    const isCurrentlyPlaying = currentPlayingId === item.id && isPlaying;

    return (
      <View>
        <VoiceNoteItem
          note={item}
          onPress={() => playVoiceNote(item)}
          onDelete={() => {
            Alert.alert(
              'Delete Voice Note',
              `Are you sure you want to delete "${item.name}"?`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => handleDeleteNote(item.id),
                },
              ],
            );
          }}
        />
        {isCurrentlyPlaying && (
          <PlaybackControls
            isPlaying={isPlaying}
            currentPosition={currentPosition}
            duration={duration}
            onPlayPause={() => playVoiceNote(item)}
            onStop={stopPlayback}
          />
        )}
      </View>
    );
  };

  if (showSettings) {
    return (
      <SettingsScreen
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Voice Recorder</Text>
          <SettingsButton onPress={() => setShowSettings(true)} />
        </View>
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
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Voice Notes ({filteredNotes.length})
          </Text>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => {
              if (!isRecording) {
                startRecording();
              }
            }}>
            <Text style={styles.newButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FlatList
          data={filteredNotes}
          renderItem={renderVoiceNote}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No voice notes found'
                : 'No voice notes yet'}
            </Text>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  newButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default RecordingScreen;
