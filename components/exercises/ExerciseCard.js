import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React, { useContext } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../helpers/AuthContext';
import Video from 'react-native-video';

const ExerciseCard = ({navigation, exerciseItem}) => {
  const { authState } = useContext(AuthContext);

  const navigateToExerciseDetails = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  }; 

  const getVideoSource = () => {
    console.log('Exercise Item:', exerciseItem);
    console.log('Auth State Gender:', authState.gender);
    console.log('Male Video:', exerciseItem.exercise.maleVideo);
    console.log('Female Video:', exerciseItem.exercise.femaleVideo);
    
    if (authState.gender === 'M' && exerciseItem.exercise.maleVideo) {
      return exerciseItem.exercise.maleVideo;
    } else if (authState.gender === 'F' && exerciseItem.exercise.femaleVideo) {
      return exerciseItem.exercise.femaleVideo;
    }
    return exerciseItem.exercise.gif; // Fallback to gif if no gender-specific video
  };

  const videoSource = getVideoSource();
  console.log('Final Video Source:', videoSource);

  const isVideo = videoSource && (videoSource.includes('.mp4') || videoSource.includes('.mov'));

  return (
    <View style={styles.workoutCard}>
          <View style={styles.imageContainer}>
            {isVideo ? (
              <Video
                source={{ uri: videoSource }}
                style={styles.workoutImage}
                resizeMode="cover"
                repeat={true}
                muted={true}
                paused={false}
                onError={(e) => console.log('Video loading error:', e)}
              />
            ) : (
            <Image
                source={{ uri: videoSource }}
              style={styles.workoutImage}
                onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
            )}
          </View>
          <View style={styles.workoutDetails}>
            <Text style={styles.workoutTitle}>{exerciseItem.exercise.name}</Text>
            <Text style={styles.workoutInfo}>Reps: {exerciseItem.suggestedReps} / Sets: {exerciseItem.suggestedSets}</Text>
            {/* <View style={styles.workoutMetrics}>
              <Text style={styles.workoutMetric}>25min</Text>
              <Text style={styles.workoutMetric}>412kcal</Text>
            </View> */}
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => navigateToExerciseDetails(exerciseItem.exercise)}>
            <MaterialIcons name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
  workoutCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  workoutImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutInfo: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  workoutMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  workoutMetric: {
    color: '#FFF',
    fontSize: 12,
  },
  playButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 20,
    padding: 10,
  },

  imageContainer: {
    borderRadius: 10,
    // padding:10,
    marginRight: 10,
    overflow: 'hidden', // Ensure the image is properly clipped to the border radius
    width: 100, // Set equal width and height for a perfect circle
    // height: 50,
  },
})

export default ExerciseCard