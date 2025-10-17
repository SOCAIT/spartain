import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, FlatList } from 'react-native';
import Dropdown from '../../components/Dropdown';
import IconHeader from '../../components/IconHeader';
import WorkoutCard from '../../components/workouts/WokroutCard';
import { COLORS } from '../../constants';
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';
import { backend_url } from '../../config/config';
import IconButton from '../../components/IconButton';
import PlanDropdown from '../../components/PlanDropdown';
import CardOverlay from '../../components/workouts/CardOverlay';
import SectionHeader from '../../components/SectionHeader';
import SearchInput from '../../components/inputs/SearchInput';
import OptionModal from '../../components/buttons/OptionModal';
import DaySelector from '../../components/DaySelector';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import debounce from 'lodash.debounce';
import SubscriptionModal from '../../components/SubscriptionModal';
import { useSubscription } from '../../hooks/useSubscription';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

axios.defaults.headers.common['Connection'] = 'close';

const WorkoutPlanScreen = () => {
  const navigation = useNavigation();
  const today = new Date();
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(currentDayIndex);
  const { authState } = useContext(AuthContext);
  const [workoutPlansData, setWorkoutPlansData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const { checkSubscription, showSubscriptionModal, setShowSubscriptionModal, handleSubscribe } = useSubscription();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length <= 4) {
        setExerciseSearchResults([]);
        return;
      }
      axios.get(`${backend_url}exercises-search/?search=${query}`)
        .then((response) => {
          console.log(response.data);
          setExerciseSearchResults(response.data.results);
        })
        .catch((error) => {
          console.error('Search error:', error);
          Alert.alert('Error', 'Failed to search exercises. Please try again.');
        });
    }, 300),
    []
  );

  const searchExercises = (query) => {
    debouncedSearch(query);
  };

  const graphql_user_workout_plans = {
    query: `
      query FetchUserWorkoutPlans {
        userWorkoutPlans(userId: ${authState?.id || 0}) {
          id
          name
          workoutSet {
            day
            name
            workoutexerciseSet {
              suggestedReps
              suggestedSets
              exercise {
                id
                name
                maleVideo
                femaleVideo
                description
                equipment
                target
                
              }
            }
          }
        }
      }
    `,
  };

  const fetchWorkouts = () => {
    if (!authState?.id) {
      console.error("User ID is missing or invalid");
      return;
    }

    console.log("Fetching workout plans for user ID:", authState.id);
    
    axios.post(`${backend_url}graphql/`, graphql_user_workout_plans, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      if (response.data?.errors) {
        console.error("GraphQL errors:", response.data.errors);
        Alert.alert("Error", "Failed to load workout plans.");
        return;
      }

      var plans = response.data?.data?.userWorkoutPlans?.map((obj) => ({
        label: obj.name,
        value: parseInt(obj.id, 10),  // Ensure the value is an integer
        workoutSet: obj.workoutSet,
      })) || [];

      // Remove plans without any workouts to avoid undefined errors
      plans = plans.filter(p => Array.isArray(p.workoutSet) && p.workoutSet.length > 0);

      // check the max day
      const maxDay = Math.max(...plans.map(plan => Math.max(...plan.workoutSet.map(workout => parseInt(workout.day, 10)))));
      console.log("Max day:", maxDay);

      if (maxDay >= 7) {

          // map the plans and make the day one less (7-> 6, 6-> 5, 5-> 4, 4-> 3, 3-> 2, 2-> 1, 1-> 0)
          plans = plans.map(plan => ({
            ...plan,
            workoutSet: plan.workoutSet.map(workout => ({
              ...workout,
              day: workout.day - 1,
              workoutexerciseSet: workout.workoutexerciseSet.map(exercise => ({
                ...exercise,
              
              }))
            }))
          }));

          // make day string from 1 to "1"
          plans = plans.map(plan => ({
            ...plan,
            workoutSet: plan.workoutSet.map(workout => ({
              ...workout,
              day: workout.day.toString()
            }))
          }));

      }
      

      console.log("Fetched Plans:", plans);

      setWorkoutPlansData(plans);
      setIsLoading(false);
      setIsRefreshing(false);

      if (plans.length > 0) {
        const initialPlan = plans[0];
        setSelectedPlan(initialPlan.value);
        
        const dayIndexStr = selectedDay.toString();
        const initialWorkout = initialPlan.workoutSet?.find(workout => workout.day === dayIndexStr);
        
        setSelectedWorkout(initialWorkout);
        console.log("Initial Plan Selected:", initialPlan);
        console.log("Initial Workout Selected:", initialWorkout);
      }
    })
    .catch((error) => {
      console.error("Error fetching workout plans:", error);
      console.error("Error details:", error.response?.data || error.message);
      setIsLoading(false);
      setIsRefreshing(false);
      Alert.alert("Error", "Failed to load workout plans. Please try again later.");
    });
  };

  const getVideoSource = (item) => {
    console.log("Getting video source for item:", item);
    if (!item) return '';
    if (authState.gender === 'M' && item.maleVideo) {
      return item.maleVideo;
    } else if (authState.gender === 'F' && item.femaleVideo) {
      return item.femaleVideo;
    }
    return item.gif || ''; // Fallback to gif if no gender-specific video
  };

  const renderSearchExerciseItem = ({ item, index }) => {
    //set item.male_video or item.female_video to item.maleVideo or item.femaleVideo
    item.maleVideo = item.male_video;
    item.femaleVideo = item.female_video;
    console.log("Rendering search exercise item:", item);
    if (!item) return null; // Skip rendering if item is null
    return(
    <TouchableOpacity style={styles.exerciseSearchItem} onPress={() => pressSearchItem(item)}>
       <View style={styles.searchImageWrapper}>
        {getVideoSource(item).includes('.mp4') || getVideoSource(item).includes('.mov') ? (
          <Video
            source={{ uri: getVideoSource(item) }}
            style={styles.gifImage}
            resizeMode="cover"
            repeat={true}
            muted={true}
            paused={false}
            onError={(e) => console.log('Video loading error:', e)}
          />
        ) : (
          <Image 
            source={{ uri: getVideoSource(item) }} 
            style={styles.gifImage}
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
        )}
      </View>
      <Text style={styles.exerciseText}>
        {item.name}
      </Text>
    </TouchableOpacity>
    )
  };

  const pressSearchItem = (item) => {
    setSelectedExercise(item);
    setExerciseSearchResults([]);
    navigateToExerciseDetails(item);
    
  }
 
  const navigateToExerciseDetails = (exercise) => {
    // check if exercise is not null
    if (exercise !== undefined) {
     navigation.navigate('ExerciseDetails', { exercise });
    }
}; 


  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchWorkouts();
  };

  const handleDayChange = (day) => {
    const dayIndex = typeof day === 'string' ? daysOfWeek.indexOf(day) : day;
    console.log(`Day selected: ${day}, converted to index: ${dayIndex}`);
    setSelectedDay(dayIndex);
  };

  useEffect(() => {
    if (selectedPlan && workoutPlansData.length > 0) {
      const currentPlan = workoutPlansData.find(plan => plan.value === selectedPlan);
      setSelectedWorkoutPlan(currentPlan);
      console.log("Current Plan:", currentPlan);
      
      if (currentPlan && currentPlan.workoutSet) {
        const dayIndexStr = selectedDay.toString();
        console.log(`Looking for workout with day: ${dayIndexStr}`);
        // map the workoutexerciseSet and make th day one less (7-> 6, 6-> 5, 5-> 4, 4-> 3, 3-> 2, 2-> 1, 1-> 0) and change the workoutforday

        // const mappedWorkoutExerciseSet = currentPlan.workoutexerciseSet.map(exercise => ({
        //   ...exercise,
        //   day: exercise.day - 1
        // }));
        
        const workoutForDay = currentPlan.workoutSet.find(workout => workout.day === dayIndexStr);
       
        
        console.log("Found workout:", workoutForDay);
        //console.log("Found workout:", workoutForDay.workoutexerciseSet);
        //console.log("Found workout exercise:", workoutForDay.workoutexerciseSet[0].exercise);
        setSelectedWorkout(workoutForDay);
      }
    }
  }, [selectedPlan, selectedDay, workoutPlansData]);

  const handlePlanChange = (planValue) => {
    console.log("Plan Selected:", planValue);
    setSelectedPlan(planValue);
    
    const currentPlan = workoutPlansData.find(plan => plan.value === planValue);
    if (currentPlan && currentPlan.workoutSet) {
      const dayIndexStr = selectedDay.toString();
      const workoutForDay = currentPlan.workoutSet.find(workout => workout.day === dayIndexStr);
      
      if (workoutForDay) {
        console.log(`Workout for day ${dayIndexStr} after plan change found`);
      } else {
        console.log(`No workout found for day ${dayIndexStr} in selected plan`);
      }
      
      setSelectedWorkout(workoutForDay);
    }
  };

  const handleDeletePlan = (deletedPlanId) => {
    // Refresh the plans after deletion
    fetchWorkouts();
  };

   const renderWorkout = () => {
    return <>
    {selectedWorkout ?  (
      // <WorkoutCard workout={selectedWorkout} navigation={navigation} />
      <CardOverlay workout={selectedWorkout} navigation={navigation} />
    ) :  (
      <View style={styles.emptyWorkoutContainer}>
        <Text style={styles.emptyWorkoutText}>No workout scheduled for {daysOfWeek[selectedDay]}</Text>
        <Text style={styles.emptyWorkoutSubtext}>
          {workoutPlansData.length > 0 
            ? "This day is a rest day or not configured in your plan"
            : "Create a workout plan to schedule exercises"
          }
        </Text>
        <TouchableOpacity 
          style={styles.createWorkoutButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createWorkoutButtonText}>
            {workoutPlansData.length > 0 ? "Add Workout" : "Create Plan"}
          </Text>
        </TouchableOpacity>
      </View>
    )}
    </>

   }

   const options = [
    {iconType: 'Ionicons', iconName: 'add-circle-outline', label: 'Add plan', onPress: () => navigation.navigate('AddModifyPlan') },
    { iconType: 'MaterialCommunityIcons',iconName: 'file-edit-outline', label: 'Update current plan',onPress:() => {
      if (selectedWorkoutPlan && selectedWorkoutPlan.workoutSet) {
        navigation.navigate('UpdateWorkoutPlan', { workoutPlan: selectedWorkoutPlan });
      } else {
        Alert.alert('Error', 'Please select a workout plan first');
      }
    }},

    // TODO: add AI workout plan screen later
    //{ iconType: 'MaterialCommunityIcons',iconName: 'brain', label: 'ask AI for plan', onPress: () => navigation.navigate('AIWorkoutPlan') },
    
    // { iconType: 'Ionicons',iconName: 'information-circle-outline', label: 'Tips', onPress: () => navigation.navigate('TipsScreen') },
  ];

  const handleCreateWorkout = () => {
    if (checkSubscription('workout_plans')) {
      navigation.navigate('CreateWorkout');
    }
  };

  const handleViewWorkout = (workout) => {
    if (checkSubscription('workout_plans')) {
      navigation.navigate('WorkoutDetails', { workout });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* <ArrowHeaderNew navigation={navigation} title={"Workout Plans"} /> */}
        
        <SearchInput 
          placeholder="Search exercises, workouts" 
          search={searchExercises} 
          results={exerciseSearchResults}
          onSelect={pressSearchItem} 
          renderSearchResultItem={renderSearchExerciseItem} 
          categories={["Workouts"]}
        />

        {/*<View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleCreateWorkout}
          >
            <Text style={styles.buttonText}>Create Workout</Text>
          </TouchableOpacity>
        </View>*/}

        <DaySelector selectedDay={daysOfWeek[selectedDay]} onDaySelect={handleDayChange} />

        <SectionHeader title="Your Workout Plans" />
        <View style={{ flexDirection: "row", marginBottom: 20, alignItems: 'center', paddingHorizontal: 20 }}>
          {isLoading ? (
            <View style={styles.emptyPlansContainer}>
              <Text style={styles.emptyPlansText}>Loading workout plans...</Text>
            </View>
          ) : workoutPlansData.length > 0 ? (
            <PlanDropdown label={"Change Workout Plan"} data={workoutPlansData} onSelect={handlePlanChange} onDelete={handleDeletePlan} />
          ) : (
            <View style={styles.emptyPlansContainer}>
              <Text style={styles.emptyPlansText}>No workout plans yet</Text>
              <Text style={styles.emptyPlansSubtext}>Create your first plan to get started</Text>
            </View>
          )}
          <IconButton name='add' onPress={() => setModalVisible(true)} />
          <IconButton name='refresh' onPress={handleRefresh} disabled={isRefreshing} />
        </View>

        <SectionHeader title={`Workout for ${daysOfWeek[selectedDay]}`} childComponent={renderWorkout()}/>

        <OptionModal
          isVisible={modalVisible}
          options={options}
          onClose={() => setModalVisible(false)}
        />

        <SubscriptionModal
          visible={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 :0,
    //paddingHorizontal: Platform.OS === 'ios' ? 20 :0


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dayButton: {
    padding: 10,
    borderRadius: 10,
  },
  exerciseList: {
    flex: 1,
    width: '100%',
    marginBottom: 16,
  },
  addButton: {
    color: 'blue',
    fontSize: 16,
  },

  optionsContainer: {
    marginVertical: Platform.select({ ios: 20, android: 15 }),
    marginHorizontal: Platform.select({ ios: 20, android: 15 }),
    paddingHorizontal:  Platform.select({ ios: 25, android: 10 }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.select({ ios: 15, android: 10 }),
    backgroundColor: '#333',
    padding: Platform.select({ ios: 15, android: 10 }),
    borderRadius: 5,
  },
  option: {
    
  },
  optionText: {
    color: '#fff',
    fontSize: Platform.select({ ios: 16, android: 14 }),
  },
  optionButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    paddingHorizontal: Platform.select({ ios: 15, android: 12 }),
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Platform.select({ ios: 16, android: 14 }),
  },

  exerciseSearchItem: {
    flexDirection: 'row',
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 5,
    // marginBottom: 10,
  },
  imageWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8, // Adjust the radius to make the image rounded
    overflow: 'hidden', // Ensures the image respects the borderRadius
  },
  searchImageWrapper: {
    width: 45,
    height: 45,
    borderRadius: 8, // Adjust the radius to make the image rounded
    overflow: 'hidden', // Ensures the image respects the borderRadius
  },
  gifImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  gifImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  exerciseTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    marginVertical: Platform.select({ ios: 20, android: 15 }),
    marginHorizontal: Platform.select({ ios: 20, android: 15 }),
    paddingHorizontal: Platform.select({ ios: 25, android: 10 }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.select({ ios: 15, android: 10 }),
    backgroundColor: '#333',
    padding: Platform.select({ ios: 15, android: 10 }),
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    paddingHorizontal: Platform.select({ ios: 15, android: 12 }),
    borderRadius: 5,
  },
  
  // Empty state styles
  emptyPlansContainer: {
    flex: 1,
    marginRight: 10,
  },
  emptyPlansText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyPlansSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  
  emptyWorkoutContainer: {
    backgroundColor: COLORS.lightDark,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyWorkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyWorkoutSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  createWorkoutButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createWorkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutPlanScreen;
