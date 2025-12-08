import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useMemo } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../helpers/AuthContext';
import Video from 'react-native-video';

const ExerciseCard = React.memo(({ navigation, exerciseItem, status = 'default', onPress }) => {
  const { authState } = useContext(AuthContext);
  const exerciseData = exerciseItem?.exercise;
  const userGender = authState?.gender;

  const navigateToExerciseDetails = (exercise) => {
    if (!exercise) return;
    navigation.navigate('ExerciseDetails', { exercise });
  }; 
  
  const getVideoSource = () => {
    if (!exerciseData) return null;

    if (userGender === 'M' && exerciseData.maleVideo) {
      return exerciseData.maleVideo;
    } else if (userGender === 'F' && exerciseData.femaleVideo) {
      return exerciseData.femaleVideo;
    }

    return exerciseData.gif || null; // Fallback to gif if no gender-specific video
  };

  const videoSource = getVideoSource();

  const isVideo = videoSource && (videoSource.includes('.mp4') || videoSource.includes('.mov'));

  const cardContainerStyle = useMemo(() => {
    const base = [styles.workoutCard];
    if (status === 'active') base.push(styles.workoutCardActive);
    if (status === 'completed') base.push(styles.workoutCardCompleted);
    if (status === 'locked') base.push(styles.workoutCardLocked);
    return base;
  }, [status]);

  const handlePress = () => {
    if (status === 'locked') return;
    if (typeof onPress === 'function') {
      onPress();
    } else {
      navigateToExerciseDetails(exerciseData);
    }
  };

  // Determine if video should play
  // Since we removed the 1Hz timer re-renders in WorkoutScreen,
  // and memoized the card, we can try enabling autoplay again for default state.
  // But be careful: too many videos playing at once can crash the app.
  // Since we are in a FlatList, windowSize and initialNumToRender can control this too.
  // For now, let's allow 'active' and 'default' to play, effectively autoplaying visible list items.
  const shouldPlay = status === 'active' || status === 'default';

  if (!exerciseData) {
    return (
      <View style={[styles.workoutCard, styles.workoutCardLocked]}>
        <View style={[styles.statusIndicator, { backgroundColor: '#555555' }]} />
        <View style={styles.workoutDetails}>
          <Text style={styles.workoutTitle}>Exercise unavailable</Text>
          <Text style={styles.workoutInfo}>This entry is missing exercise details.</Text>
        </View>
      </View>
    );
  }

  const statusChip = () => {
    if (status === 'active') {
      return (
        <View style={[styles.pill, styles.pillActive]}>
          <Text style={styles.pillText}>Up next</Text>
        </View>
      );
    }
    if (status === 'completed') {
      return (
        <View style={[styles.pill, styles.pillCompleted]}>
          <MaterialIcons name="check" size={14} color="#4fd675" />
          <Text style={[styles.pillText, { marginLeft: 4 }]}>Done</Text>
        </View>
      );
    }
    if (status === 'locked') {
      return (
        <View style={[styles.pill, styles.pillLocked]}>
          <MaterialIcons name="lock" size={14} color="#b5b5b5" />
          <Text style={[styles.pillText, { marginLeft: 4 }]}>Locked</Text>
        </View>
      );
    }
    return null;
  };

  const indicatorStyle = useMemo(() => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#FF6A00' };
      case 'completed':
        return { backgroundColor: '#4fd675' };
      case 'locked':
        return { backgroundColor: '#555555' };
      default:
        return { backgroundColor: '#404040' };
    }
  }, [status]);

  const targetMuscle = exerciseData?.bodyPart || exerciseData?.target || 'Workout';
  const equipment = exerciseData?.equipment || 'Bodyweight';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={cardContainerStyle}
      onPress={handlePress}
      disabled={status === 'locked'}
    >
      <View style={[styles.statusIndicator, indicatorStyle]} />
      <View style={styles.mediaWrapper}>
        {videoSource ? (
          isVideo ? (
            <Video
              source={{ uri: videoSource }}
              style={styles.workoutImage}
              resizeMode="cover"
              repeat={true}
              muted={true}
              paused={!shouldPlay}
              // mixWithOthers={true}
              onError={(e) => console.log('Video loading error:', e)}
            />
          ) : (
            <Image
              source={{ uri: videoSource }}
              style={styles.workoutImage}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
          )
        ) : (
          <View style={styles.mediaFallback}>
            <MaterialIcons name="image-not-supported" size={22} color="#777" />
            <Text style={styles.mediaFallbackText}>No preview</Text>
          </View>
        )}
      </View>
      <View style={styles.workoutDetails}>
        <View style={styles.titleRow}>
          <Text style={styles.workoutTitle} numberOfLines={2}>{exerciseData.name || 'Workout'}</Text>
          {statusChip()}
        </View>
        <Text style={styles.workoutInfo}>Reps: {exerciseItem.suggestedReps} • Sets: {exerciseItem.suggestedSets}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaTag}>
            <Text style={styles.metaText}>{targetMuscle}</Text>
          </View>
          <View style={styles.metaTag}>
            <Text style={styles.metaText}>{equipment}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.chevronWrapper, status === 'locked' && { opacity: 0.5 }]}>
        <MaterialIcons name="chevron-right" size={26} color="#FFF" />
      </View>
    </TouchableOpacity>
  )
}, (prevProps, nextProps) => {
  // Custom comparison logic for React.memo
  // We intentionally ignore onPress changes because the parent (WorkoutScreen)
  // creates a new arrow function on every render (triggered by the timer),
  // but the underlying logic/item hasn't changed.
  return (
    prevProps.status === nextProps.status &&
    prevProps.exerciseItem === nextProps.exerciseItem
  );
});

const styles = StyleSheet.create({
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  workoutCardActive: {
    borderWidth: 1,
    borderColor: '#FF6A00',
    backgroundColor: '#333333',
  },
  workoutCardCompleted: {
    opacity: 0.85,
  },
  workoutCardLocked: {
    opacity: 0.6,
  },
  mediaWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    width: 96,
    height: 96,
    backgroundColor: '#1f1f1f',
  },
  mediaFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#161616',
  },
  mediaFallbackText: {
    color: '#777',
    fontSize: 12,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  workoutDetails: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  workoutTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  workoutInfo: {
    color: '#b5b5b5',
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#1f1f1f',
  },
  metaText: {
    color: '#e3e3e3',
    fontSize: 12,
    fontWeight: '600',
  },
  chevronWrapper: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 999,
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  pillActive: {
    backgroundColor: '#40352f',
    borderColor: '#FF6A00',
    borderWidth: 1,
  },
  pillCompleted: {
    backgroundColor: '#233323',
  },
  pillLocked: {
    backgroundColor: '#3a3a3a',
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
})

export default ExerciseCard