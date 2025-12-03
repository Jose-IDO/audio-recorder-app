import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import SettingsIcon from '../components/icons/SettingsIcon';

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
        <View style={styles.headerTitleContainer}>
          <SettingsIcon size={24} color="#6366f1" />
          <Text style={styles.title}>Settings</Text>
        </View>
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
              onPress={() => setPlaybackSpeed(speed)}
              activeOpacity={0.7}>
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
        <TouchableOpacity
          style={styles.settingButton}
          onPress={handleFeedback}
          activeOpacity={0.7}>
          <Text style={styles.settingButtonText}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={handleSupport}
          activeOpacity={0.7}>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  speedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  speedButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 60,
    alignItems: 'center',
  },
  speedButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  speedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  speedButtonTextActive: {
    color: '#ffffff',
  },
  settingButton: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
  },
});

export default SettingsScreen;
