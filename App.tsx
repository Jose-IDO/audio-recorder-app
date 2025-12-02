import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import RecordingScreen from './src/screens/RecordingScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <RecordingScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;

