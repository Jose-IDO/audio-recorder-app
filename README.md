# Audio Recorder App

A modern React Native application built with Expo for recording, managing, and playing back voice notes. This app provides a simple and intuitive interface for creating a digital voice journal.

## Download

**Download the app directly:**
- [Download APK from Google Drive](https://drive.google.com/drive/folders/1cieRSInF1r5M4fzsMwlvyE1xs1voGPUt?usp=sharing)

## Features

### Core Functionality
- **Audio Recording**: Record high-quality voice notes using your device's microphone
- **Voice Note Management**: View all your recordings in a clean, organized list
- **Playback Controls**: Play, pause, and stop recordings with visual feedback and a progress bar
- **Delete Functionality**: Remove unwanted voice notes with confirmation dialogs
- **Search**: Quickly find specific voice notes by name
- **Rename Voice Notes**: Quickly rename any recording to keep your journal organized
- **Favorite Voice Notes**: Mark important notes as favorites and filter to see only favorites
- **Offline Support**: All recordings are stored locally on your device

### User Experience
- **Modern UI**: Clean, modern interface with smooth animations
- **Permission Handling**: Permissions are requested only when needed (when you try to record)
- **Smart Date Formatting**: Displays dates in a user-friendly format (Today, Yesterday, etc.)
- **Settings Screen**: Customize playback speed and access support options
- **Full-Screen Rename Overlay**: Renaming a note opens a focused overlay on top of the app

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build service
- **TypeScript**: Type-safe JavaScript
- **Expo AV**: Audio recording and playback
- **Expo File System**: File management
- **AsyncStorage**: Local data persistence
- **React Native SVG**: Scalable vector graphics for icons

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)
- Expo Go app on your mobile device (for development)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jose-IDO/audio-recorder-app.git
   cd audio-recorder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## Building the App

### Using EAS Build

1. **Install EAS CLI** (if not already installed)
   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account**
   ```bash
   eas login
   ```

3. **Build for Android**
   ```bash
   eas build --platform android --profile preview
   ```

4. **Build for iOS**
   ```bash
   eas build --platform ios --profile preview
   ```

5. **Build for both platforms**
   ```bash
   eas build --platform all --profile preview
   ```

The build will run in the cloud and you'll receive a download link when complete.

## Project Structure

```
audio-recorder-app/
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
├── eas.json                # EAS build configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── icons/          # SVG icon components
│   │   ├── PlaybackControls.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SettingsButton.tsx
│   │   └── VoiceNoteItem.tsx
│   ├── screens/            # Screen components
│   │   ├── RecordingScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/           # Business logic
│   │   └── StorageService.ts
│   └── types/              # TypeScript type definitions
│       └── VoiceNote.ts
└── README.md
```

## Usage

### Recording a Voice Note

1. Tap the large circular record button at the top of the screen
2. Grant microphone permission when prompted (first time only)
3. Speak your voice note
4. Tap the button again to stop recording
5. Your recording will be automatically saved

### Playing a Voice Note

1. Tap on any voice note in the list
2. Use the playback controls to play, pause, or stop
3. View the current position and total duration

### Deleting a Voice Note

1. Tap the delete button (trash icon) on any voice note
2. Confirm the deletion in the dialog

### Searching Voice Notes
### Favoriting Voice Notes

1. Tap the **Favorite** button on any voice note
2. A favorited note will show as **Favorited**
3. Use the **All / Favorites** chips above the list to switch between all notes and only favorites

### Renaming Voice Notes

1. Tap the **Rename** button on a voice note
2. A rename overlay appears on top of the app
3. Enter the new name and tap **Save**
4. The updated name is stored and used in lists and search

1. Use the search bar at the top of the list
2. Type to filter voice notes by name
3. Clear the search to show all notes

### Settings

1. Tap the settings icon in the top right
2. Adjust playback speed
3. Access feedback and support options

## Permissions

The app requires the following permissions:

- **Microphone**: Required for recording voice notes
  - Requested only when you attempt to record
  - Can be managed in device settings

## Storage

- All voice notes are stored locally on your device
- Recordings are saved in the app's document directory
- Metadata is stored using AsyncStorage
- No data is sent to external servers

## Development

### Running Locally

```bash
npm start
```

### Running on Specific Platform

```bash
npm run android    # Android
npm run ios        # iOS (macOS only)
npm run web        # Web browser
```

### Code Style

This project uses:
- TypeScript for type safety
- Functional components with hooks
- Simple, straightforward code patterns
- Reusable component architecture

## Troubleshooting

### Permission Issues
- If microphone permission is denied, enable it in your device settings
- On Android: Settings > Apps > Audio Recorder > Permissions
- On iOS: Settings > Privacy > Microphone > Audio Recorder

### Build Issues
- Ensure you're logged into Expo: `eas login`
- Check that all dependencies are installed: `npm install`
- Clear cache if needed: `expo start -c`

### Audio Playback Issues
- Ensure device volume is not muted
- Check that the audio file exists and is not corrupted
- Try restarting the app

## Contributing

This is a learning project. Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

## License

This project is open source and available for educational purposes.

## Support

For support, email: support@voicerecorder.com

## Version History

- **v1.1.0**
  - Added favorites for voice notes with All/Favorites filter
  - Added rename overlay for editing note titles
  - Improved playback experience with pause/resume and progress bar
- **v1.0.0**
  - Basic recording functionality
  - Voice note management
  - Playback controls
  - Search functionality
  - Settings screen
