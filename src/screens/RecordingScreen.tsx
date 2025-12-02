import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import {Audio} from 'expo-av';
import * as FileSystem from 'expo-file-system';
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

const RecordingScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<VoiceNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [showSettings, setShowSettings] = useState(false);
  const playbackInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      await loadVoiceNotes();
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize app');
    }
  };

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
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    };
  }, [sound, recording]);

  const loadVoiceNotes = async () => {
    const notes = await getVoiceNotes();
    const sortedNotes = notes.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setVoiceNotes(sortedNotes);
  };

  const checkPermissions = async () => {
    const permissionResponse = await Audio.getPermissionsAsync();
    if (permissionResponse.status === 'granted') {
      return true;
    }
    
    if (permissionResponse.canAskAgain) {
      const newPermissionResponse = await Audio.requestPermissionsAsync();
      return newPermissionResponse.status === 'granted';
    }
    
    return false;
  };

  const startRecording = async () => {
    if (isPlaying) {
      stopPlayback();
    }

    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required to record');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const {recording: newRecording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);

      if (uri) {
        const timestamp = Date.now();
        const fileName = `voiceNote_${timestamp}.m4a`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.moveAsync({
          from: uri,
          to: fileUri,
        });

        const newNote: VoiceNote = {
          id: timestamp.toString(),
          name: `Voice Note ${new Date(timestamp).toLocaleDateString()}`,
          path: fileUri,
          date: new Date(timestamp).toISOString(),
          duration: 0,
        };

        await saveVoiceNote(newNote);
        await loadVoiceNotes();

        Alert.alert('Success', 'Recording saved');
      }
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
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      }
      return;
    }

    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const {sound: newSound} = await Audio.Sound.createAsync(
        {uri: note.path},
        {shouldPlay: true},
      );

      setSound(newSound);
      setIsPlaying(true);
      setCurrentPlayingId(note.id);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          const minutes = Math.floor((status.positionMillis || 0) / 1000 / 60);
          const seconds = Math.floor(((status.positionMillis || 0) / 1000) % 60);
          setCurrentPosition(
            `${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}`,
          );

          const totalMinutes = Math.floor((status.durationMillis || 0) / 1000 / 60);
          const totalSeconds = Math.floor(((status.durationMillis || 0) / 1000) % 60);
          setDuration(
            `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds
              .toString()
              .padStart(2, '0')}`,
          );

          if (status.didJustFinish) {
            stopPlayback();
          }
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setCurrentPlayingId(null);
    setCurrentPosition('00:00');
    setDuration('00:00');
    if (playbackInterval.current) {
      clearInterval(playbackInterval.current);
      playbackInterval.current = null;
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (currentPlayingId === id && isPlaying) {
      await stopPlayback();
    }

    try {
      const note = voiceNotes.find(n => n.id === id);
      if (note) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(note.path);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(note.path);
          }
        } catch (error) {
        }
      }
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
