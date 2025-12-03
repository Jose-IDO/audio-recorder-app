import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import StopIcon from './icons/StopIcon';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentPosition: string;
  duration: string;
  onPlayPause: () => void;
  onStop: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentPosition,
  duration,
  onPlayPause,
  onStop,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{currentPosition}</Text>
        <View style={styles.separator} />
        <Text style={styles.timeText}>{duration}</Text>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={onPlayPause}
          activeOpacity={0.8}>
          {isPlaying ? (
            <PauseIcon size={20} color="#fff" />
          ) : (
            <PlayIcon size={20} color="#fff" />
          )}
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={onStop}
          activeOpacity={0.8}>
          <StopIcon size={18} color="#fff" />
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.5,
  },
  separator: {
    width: 8,
    height: 1,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default PlaybackControls;
