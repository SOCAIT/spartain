# Video Audio Mixing Fix - Spotify & Other Apps

## Problem
When entering a screen with video playback, music from other apps (Spotify, Apple Music, etc.) stops. This is because the video player was taking exclusive control of the audio session.

## Solution
Added `mixWithOthers={true}` prop to all Video components throughout the app. This tells the React Native Video library to allow audio mixing with other apps instead of taking exclusive control.

## Changes Made

Updated all Video components in the following files:

1. **pages/Program/ExerciseDetailsScreeen.js** - Exercise detail video display
2. **pages/Program/ExerciseSearch.js** - Exercise search results
3. **components/exercises/ExerciseCard.js** - Exercise cards in workouts
4. **pages/Program/CreateWorkoutScreen.js** - Creating new workouts
5. **pages/Program/update/UpdateWorkoutScreen.js** - Updating existing workouts (2 instances)
6. **pages/Program/WorkoutPlanScreen.js** - Workout plan view

## Technical Details

### What `mixWithOthers={true}` does:
- **iOS**: Allows audio session mixing so background audio from other apps continues playing
- **Android**: Configures audio focus to "duck" other audio (other apps are muted but will resume when video finishes)
- Prevents exclusive audio session control by the video player

### Example Implementation:
```jsx
<Video
  source={{ uri: videoSource }}
  style={styles.videoStyle}
  repeat={true}
  muted={true}
  paused={false}
  mixWithOthers={true}  // ← Added this line
  resizeMode="cover"
/>
```

## Testing
1. Open Spotify or Apple Music and start playing music
2. Navigate to an exercise that shows a video
3. Music should continue playing (though it may be slightly quieter on Android due to audio ducking)

## Related Properties
- `muted={true}` - Videos are currently muted (no audio output)
- `repeat={true}` - Videos loop
- `paused={false}` - Videos autoplay

## Notes
- Since all videos have `muted={true}`, the audio mixing is mainly beneficial if you decide to enable video audio in the future
- The fix is compatible with both iOS and Android
- No additional dependencies needed - `react-native-video` already supports this prop

