import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

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
        <Text style={styles.timeText}> / </Text>
        <Text style={styles.timeText}>{duration}</Text>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={onPlayPause}>
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={onStop}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PlaybackControls;

