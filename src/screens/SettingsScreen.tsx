import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({onBack}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const handleFeedback = () => {
    Alert.alert(
      'Feedback',
      'Thank you for using Voice Recorder! Please email your feedback to support@voicerecorder.com',
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'For support, please email: support@voicerecorder.com',
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playback Speed</Text>
        <View style={styles.speedContainer}>
          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.speedButton,
                playbackSpeed === speed && styles.speedButtonActive,
              ]}
              onPress={() => setPlaybackSpeed(speed)}>
              <Text
                style={[
                  styles.speedButtonText,
                  playbackSpeed === speed && styles.speedButtonTextActive,
                ]}>
                {speed}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.settingButton} onPress={handleFeedback}>
          <Text style={styles.settingButtonText}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton} onPress={handleSupport}>
          <Text style={styles.settingButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoText}>
          Voice Recorder v1.0.0{'\n'}
          All recordings are stored locally on your device.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  speedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  speedButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  speedButtonActive: {
    backgroundColor: '#2196F3',
  },
  speedButtonText: {
    fontSize: 14,
    color: '#333',
  },
  speedButtonTextActive: {
    color: '#fff',
  },
  settingButton: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  settingButtonText: {
    fontSize: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;

