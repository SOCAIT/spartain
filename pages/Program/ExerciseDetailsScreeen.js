import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { View, Image, ScrollView, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Video from 'react-native-video';

import { COLORS } from '../../constants';
import { backend_url } from '../../config/config';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import InstructionsModal from '../../components/modals/InstructionModal';
import ExerciseHistory from '../../components/exercises/ExerciseHistory';
import ButtonRow from '../../components/buttons/ButtonRow';
import { AuthContext } from '../../helpers/AuthContext';
import ExerciseLogModal from '../../components/modals/ExerciseLogModal';
import LatestLog from '../../components/exercises/LatestLog';

// Helper function to get an array of the last 6 months in "YYYY-MM" format
const getLastSixMonths = () => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 6; i++) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    months.unshift(`${year}-${month}`);
    currentDate.setMonth(currentDate.getMonth() - 1);
  }
  return months;
};

const lastSixMonths = getLastSixMonths();

// Initial dummy data
const dummyData = {
  average_weight: {
    "12+ reps": Object.fromEntries(lastSixMonths.map(month => [month, 0])),
    "4-5 reps": Object.fromEntries(lastSixMonths.map(month => [month, 0])),
    "6-8 reps": Object.fromEntries(lastSixMonths.map(month => [month, 0])),
    "9-12 reps": Object.fromEntries(lastSixMonths.map(month => [month, 0]))
  },
  max_weight: {
    "4-5 reps": 0,
    "6-8 reps": 0,
    "9-12 reps": 0,
    "12+ reps": 0
  }
};

const ExerciseDetailsScreen = ({ route }) => {
  const { exercise } = route.params;
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [updateLogModalVisible, setUpdateLogModalVisible] = useState(false);
  // Use the dummy data as initial state
  const [exerciseHistory, setExerciseHistory] = useState(dummyData.average_weight);
  const [latestLogs, setLatestLogs] = useState(dummyData.max_weight);
  // A refresh key to force re-render of child components when data updates
  const [refreshKey, setRefreshKey] = useState(0);

  // // GraphQL query string
  // const graphql_user_ex_logs = {
  //   query: `
  //     query {
  //       userExlogsByName(userId: ${authState.id}, exerciseName: "${exercise.name}")
  //     }
  //   `
  // };

  const graphql_user_ex_logs = useMemo(() => ({
    query: `
      query {
        userExlogsByName(userId: ${authState.id}, exerciseName: "${exercise.name}")
      }
    `
  }), [authState.id, exercise.name]);

  // // Function to fetch data from backend
  // const fetchExerciseData = useCallback(() => {
  //   axios.post(backend_url + 'graphql/', graphql_user_ex_logs)
  //     .then(response => {
  //       // Parse the JSON string into an object
  //       const data = JSON.parse(response.data.data.userExlogsByName);
  //       console.log('Fetched exercise data:', data);
  //       // For a complete refresh, replace the states directly:
  //       if (data.average_weight && data.max_weight) {
  //         setExerciseHistory(data.average_weight);
  //         setLatestLogs(data.max_weight);
  //         // Update the key to force a re-render of components that may cache props
  //         setRefreshKey(prevKey => prevKey + 1);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching exercise history:', error);
  //     });
  // }, [authState.id, exercise.name]);

  const fetchExerciseData = useCallback(() => {
    axios.post(backend_url + 'graphql/', graphql_user_ex_logs)
      .then(response => {
        const data = JSON.parse(response.data.data.userExlogsByName);
        if (data) {
          // Merge data with dummy values for exerciseHistory (average_weight)
          const updatedHistory = {};
          Object.keys(dummyData.average_weight).forEach(repRange => {
            updatedHistory[repRange] = {};
            Object.keys(dummyData.average_weight[repRange]).forEach(month => {
              updatedHistory[repRange][month] =
                data.average_weight &&
                data.average_weight[repRange] &&
                data.average_weight[repRange][month] !== undefined
                  ? data.average_weight[repRange][month]
                  : dummyData.average_weight[repRange][month];
            });
          });
  
          // Merge data with dummy values for latestLogs (max_weight)
          const updatedLatest = {};
          Object.keys(dummyData.max_weight).forEach(repRange => {
            updatedLatest[repRange] =
              data.max_weight &&
              data.max_weight[repRange] !== undefined
                ? data.max_weight[repRange]
                : dummyData.max_weight[repRange];
          });
  
          // Only update if the new data differs from the current state
          if (JSON.stringify(updatedHistory) !== JSON.stringify(exerciseHistory)) {
            setExerciseHistory(updatedHistory);
          }
          if (JSON.stringify(updatedLatest) !== JSON.stringify(latestLogs)) {
            setLatestLogs(updatedLatest);
          }
          // Optionally update refreshKey only if needed
          setRefreshKey(prevKey => prevKey + 1);
        }
      })
      .catch(error => {
        console.error('Error fetching exercise history:', error);
      });
  }, [graphql_user_ex_logs, exerciseHistory, latestLogs]);

  const getVideoSource = () => {
    console.log('Exercise:', exercise);
    console.log('Auth State Gender:', authState.gender);
    console.log('Male Video:', exercise.male_video);
    console.log('Female Video:', exercise.female_video);

    // the video might me either in the form  of male_video or maleVideo, same for female_video and FemaleVideo

    
    
    if (authState.gender === 'M' && exercise.male_video) {
      return exercise.male_video;
    } else if (authState.gender === 'F' && exercise.female_video) {
      return exercise.female_video;

    } else if(exercise.maleVideo){
      return exercise.maleVideo;
    } else if(exercise.femaleVideo){
      return exercise.femaleVideo;
    }

    return exercise.gif; // Fallback to gif if no gender-specific video
  };

  const videoSource = getVideoSource();
  console.log('Final Video Source:', videoSource);

  const isVideo = videoSource && (videoSource.includes('.mp4') || videoSource.includes('.mov'));

  // Initial data fetch on component mount
  useEffect(() => {
    fetchExerciseData();
  }, [fetchExerciseData]);

  // Re-fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchExerciseData();
    }, [fetchExerciseData])
  );

  // Callback for when the ExerciseLogModal closes
  const handleLogModalClose = () => {
    setUpdateLogModalVisible(false);
    fetchExerciseData(); // Refresh data immediately
  };

  const buttons = [
    { 
      title: 'Instructions',  
      onPress: () => setModalVisible(true), 
      style: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 5
      } 
    },
    { 
      title: 'Add Exercise Log', 
      onPress: () => setUpdateLogModalVisible(true),   
      style: {
        backgroundColor: COLORS.darkOrange,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 5
      } 
    }
  ];

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={exercise.name}/>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}> 
        <View style={styles.imageContainer}>
          {isVideo ? (
            <Video
              source={{ uri: videoSource }}
              //style={styles.gifImage}
              resizeMode="cover"
              //width={300}
              height={300}
              repeat={true}
              muted={true}
              paused={false}
              onError={(e) => console.log('Video loading error:', e)}
            />
          ) : (
            <Image 
              source={{ uri: videoSource }} 
              style={styles.gifImage}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
          )}
        </View>
        <ButtonRow buttons={buttons} />
        {/* Passing refreshKey as key forces a re-render when data changes */}
        <LatestLog key={`latest-${refreshKey}`} exercise={exercise} data={latestLogs} />
        <ExerciseHistory key={`history-${refreshKey}`} history={exerciseHistory} />
      </ScrollView>

      <InstructionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        instructions={exercise.description}
      />

      <ExerciseLogModal 
        exerciseName={exercise.name}
        user={authState.id}
        visible={updateLogModalVisible} 
        onClose={handleLogModalClose} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
     paddingTop: Platform.OS === 'ios' ? 45 :0,
     paddingHorizontal: Platform.OS === 'ios' ? 20 :0
    //alignItems: 'center',
  },
  body:{
   // alignItems: 'center',

  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.white
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden', // Ensure the image is properly clipped to the border radius
    width: '90%', // Set equal width and height for a perfect circle
    height: 300,
    marginBottom: 20,
  },
  gifImage: {
    width: 300,
    height: 200,
    // marginBottom: 20,

    flex: 1,
    width: null,
    height: null,
    // borderRadius: 20
    //borderRadius: 100, // Make the border circular
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.white

  },
  detailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.white

  },
  historyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.white
  },
  historyItem: {
    marginBottom: 10,
  },

  latestLogsSection: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logCategory: {
    color: COLORS.white,
    fontSize: 16,
  },
  logWeight: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseDetailsScreen;
