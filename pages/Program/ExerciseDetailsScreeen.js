import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../constants';
import { backend_url } from '../../config/config';
import ArrowHeader from '../../components/ArrowHeader';
import InstructionsModal from '../../components/modals/InstructionModal';
import ExerciseHistory from '../../components/exercises/ExerciseHistory';
import ButtonRow from '../../components/buttons/ButtonRow';

import { AuthContext } from '../../helpers/AuthContext';
import ExerciseLogModal from '../../components/modals/ExerciseLogModal';
import LatestLog from '../../components/exercises/LatestLog';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

// Helper function to get an array of the last 6 months in "YYYY-MM" format
const getLastSixMonths = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 6; i++) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is in "MM" format
    months.unshift(`${year}-${month}`);
    currentDate.setMonth(currentDate.getMonth() - 1); // Move to the previous month
  }

  return months;
};

// Generate the last 6 months
const lastSixMonths = getLastSixMonths();

// Create the dummy data using the last 6 months
const dummyData = {
  "average_weight": {
    "12+ reps": Object.fromEntries(lastSixMonths.map(month => [month, 0])),
    "4-5 reps": Object.fromEntries(lastSixMonths.map(month => [month, 0])),
    "6-8 reps": Object.fromEntries(lastSixMonths.map(month => [month, 0])),
    "9-12 reps": Object.fromEntries(lastSixMonths.map(month => [month, 0]))
  },
  "max_weight": {
    "4-5 reps": 0,
    "6-8 reps": 0,
    "9-12 reps": 0,
    "12+ reps": 0
  }
};


// const dummyData = {
//   "average_weight":{
//     "12+ reps": {
//       "2024-01": 0,
//       "2024-02": 0,
//       "2024-03": 0,
//       "2024-04": 0,
//       "2024-05": 0,
//       "2024-06": 0
//     },
//     "4-5 reps": {
//       "2024-01": 0,
//       "2024-02": 0,
//       "2024-03": 0,
//       "2024-04": 0,
//       "2024-05": 0,
//       "2024-06": 0
//     },
//     "6-8 reps": {
//       "2024-01": 0,
//       "2024-02": 0,
//       "2024-03": 0,
//       "2024-04": 0,
//       "2024-05": 0,
//       "2024-06": 0
//     },
//     "9-12 reps": {
//       "2024-01": 0,
//       "2024-02": 0,
//       "2024-03": 0,
//       "2024-04": 0,
//       "2024-05": 0,
//       "2024-06": 0
//     }
// },
// "max_weight": {
//   "4-5 reps": 0,
//   "6-8 reps": 0,
//   "9-12 reps": 0,
//   "12+ reps": 0,
// }
// };



const ExerciseDetailsScreen = ({ route }) => {
  const { exercise } = route.params;
  const navigation = useNavigation();
  const {authState} = useContext(AuthContext)


  const [modalVisible, setModalVisible] = useState(false);
  const [updateLogModalVisible, setUpdateLogModalVisible] = useState(false);


  const [exerciseHistory, setExerciseHistory] = useState(dummyData['average_weight']);
  const [latestLogs, setLatestLogs] = useState(dummyData['max_weight']);



  const graphql_user_ex_logs = { query: " \
  query { \ " +
  "userExlogsByName(userId:" + authState.id +", exerciseName: \"" + exercise.name + "\") }"      
  }

  

  const buttons = [
    { title: 'Instructions',  onPress:() => setModalVisible(true), 
      style: {backgroundColor: COLORS.primary,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginHorizontal:5} },
    { title: 'Add Exercise Log', onPress: () =>  setUpdateLogModalVisible(true),   
      style: {backgroundColor: COLORS.darkOrange,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginHorizontal:5} },
    // { title: 'Similar', onPress: () => console.log('Button 3 pressed') },
  ];
 
  useEffect(() => {
    // console.log(exercise.description.split(":"))
    // console.log(authState.id)
    // console.log(exerciseHistory)
    // Fetch exercise history from the backend using Axios
    axios.post(backend_url + 'graphql/', graphql_user_ex_logs)
      .then(response => {
        // Assuming the response contains an array of exercise history objects

        console.log(response.data.data)
      

        // Parse the JSON string into a JavaScript object
        const data = JSON.parse(response.data.data.userExlogsByName);

           

        // Accessing values
        // const reps12Plus = data["12+ reps"]["2024-04"];
        // const reps4to5 = data["4-5 reps"]["2024-04"];
        // const reps6to8 = data["6-8 reps"]["2024-04"];
        // const reps9to12 = data["9-12 reps"]["2024-04"];
        // setExerciseHistory(data['average_weight']);

        // Step 2: Update `exerciseHistory` while keeping previous records
        setExerciseHistory(prevHistory => ({
          ...prevHistory,
          ...Object.keys(data.average_weight || {}).reduce((acc, key) => {
            acc[key] = {
              ...prevHistory[key], // Keep existing sub-records for each rep range
              ...data.average_weight[key] // Merge new sub-records
            };
            return acc;
          }, {})
        }));

        // Step 3: Update `latestLogs` while keeping previous records
        setLatestLogs(prevLogs => ({
          ...prevLogs,
          ...data.max_weight // Merge new data into `max_weight`
        }));

      })
      .catch(error => {
        console.error('Error fetching exercise history:', error);
      });
  }, []); // Empty dependency array to fetch data only once when the component mounts

  return (
    <View style={styles.container}>
      {/* <ArrowHeader navigation={navigation} title={exercise.name} />  */}
      <ArrowHeaderNew  navigation={navigation}  />
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}> 
      {/* <Text style={styles.header}>{exercise.name}</Text> */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: exercise.gif }} style={styles.gifImage} />
      </View>
      {/* <Text style={styles.historyHeader}>Instructions</Text> */}

      <ButtonRow buttons={buttons} />
     
      <LatestLog exercise={exercise} data={latestLogs} />

      <ExerciseHistory history={exerciseHistory} />

      
      </ScrollView>

      <InstructionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        instructions={exercise.description}
      />

      
      {/* ExerciseLogModal Component */}
      <ExerciseLogModal 
        exerciseName={exercise.name}
        user={authState.id}
        visible={updateLogModalVisible} 
        onClose={() => setUpdateLogModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 10,
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
    width: '80%', // Set equal width and height for a perfect circle
    height: 200,
    marginBottom: 20,
  },
  gifImage: {
    // width: 300,
    // height: 200,
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
