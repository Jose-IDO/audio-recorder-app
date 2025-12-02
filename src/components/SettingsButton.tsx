import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface SettingsButtonProps {
  onPress: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>⚙️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
});

export default SettingsButton;

