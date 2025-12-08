# Workout Plans - Cheat Sheet

## Copy-Paste Ready Code Snippets

### 1. Basic Setup
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

export const MyScreen = () => {
  const { selectedPlan, allPlans, updateWorkoutPlans } = useWorkoutPlans();
  
  return (
    <View>
      <Text>Plan: {selectedPlan?.label}</Text>
    </View>
  );
};
```

### 2. Show Today's Workout
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

export const HomeScreen = () => {
  const { selectedPlan } = useWorkoutPlans();
  
  const getTodayWorkout = () => {
    const today = new Date();
    const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const dayStr = dayIndex.toString();
    return selectedPlan?.workoutSet?.find(w => w.day === dayStr);
  };
  
  const workout = getTodayWorkout();
  
  return (
    <View>
      {workout ? (
        <Text>{workout.name}</Text>
      ) : (
        <Text>Rest Day</Text>
      )}
    </View>
  );
};
```

### 3. List All Plans with Selection
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';
import { Picker } from '@react-native-picker/picker';

export const PlanSelector = () => {
  const { selectedPlan, allPlans, updateWorkoutPlans } = useWorkoutPlans();
  
  const handleChange = async (planValue) => {
    const newPlan = allPlans.find(p => p.value === planValue);
    if (newPlan) {
      await updateWorkoutPlans(newPlan, allPlans);
    }
  };
  
  return (
    <Picker
      selectedValue={selectedPlan?.value}
      onValueChange={handleChange}
    >
      {allPlans.map(plan => (
        <Picker.Item 
          key={plan.value} 
          label={plan.label} 
          value={plan.value} 
        />
      ))}
    </Picker>
  );
};
```

### 4. Display All Exercises
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';
import { FlatList } from 'react-native';

export const AllExercisesScreen = () => {
  const { selectedPlan } = useWorkoutPlans();
  
  const getAllExercises = () => {
    return selectedPlan?.workoutSet?.flatMap(
      workout => workout.workoutexerciseSet || []
    ) || [];
  };
  
  const exercises = getAllExercises();
  
  return (
    <FlatList
      data={exercises}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.exercise?.name}</Text>
          <Text>{item.suggestedSets} × {item.suggestedReps}</Text>
        </View>
      )}
    />
  );
};
```

### 5. Get Specific Exercise
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

export const FindExercise = ({ exerciseName = 'Bench Press' }) => {
  const { selectedPlan } = useWorkoutPlans();
  
  const exercise = selectedPlan?.workoutSet
    ?.flatMap(w => w.workoutexerciseSet || [])
    ?.find(ex => ex.exercise?.name === exerciseName);
  
  return (
    <View>
      {exercise ? (
        <View>
          <Text>{exercise.exercise?.name}</Text>
          <Text>Sets: {exercise.suggestedSets}</Text>
          <Text>Reps: {exercise.suggestedReps}</Text>
        </View>
      ) : (
        <Text>Exercise not found</Text>
      )}
    </View>
  );
};
```

### 6. Get Specific Day's Workout
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

export const DayWorkoutScreen = ({ dayIndex }) => {
  const { selectedPlan } = useWorkoutPlans();
  
  const dayWorkout = selectedPlan?.workoutSet?.find(
    w => w.day === dayIndex.toString()
  );
  
  return (
    <View>
      {dayWorkout ? (
        <View>
          <Text>{dayWorkout.name}</Text>
          {dayWorkout.workoutexerciseSet?.map((ex, i) => (
            <Text key={i}>{ex.exercise?.name}</Text>
          ))}
        </View>
      ) : (
        <Text>No workout for this day</Text>
      )}
    </View>
  );
};
```

### 7. Count Exercises in Plan
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

export const PlanStats = () => {
  const { selectedPlan } = useWorkoutPlans();
  
  const totalExercises = selectedPlan?.workoutSet?.reduce(
    (count, workout) => count + (workout.workoutexerciseSet?.length || 0),
    0
  );
  
  const totalWorkouts = selectedPlan?.workoutSet?.length || 0;
  
  return (
    <View>
      <Text>Workouts: {totalWorkouts}</Text>
      <Text>Total Exercises: {totalExercises}</Text>
    </View>
  );
};
```

### 8. Search Exercises
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

export const SearchExercises = ({ query }) => {
  const { selectedPlan } = useWorkoutPlans();
  
  const results = selectedPlan?.workoutSet
    ?.flatMap(w => w.workoutexerciseSet || [])
    ?.filter(ex => 
      ex.exercise?.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];
  
  return (
    <FlatList
      data={results}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => <Text>{item.exercise?.name}</Text>}
    />
  );
};
```

### 9. Check Plan Status
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

export const PlanStatus = () => {
  const { selectedPlan, allPlans } = useWorkoutPlans();
  
  const hasPlan = !!selectedPlan?.id;
  const hasMultiplePlans = allPlans.length > 1;
  const isRest = !selectedPlan?.workoutSet?.find(
    w => w.day === new Date().getDay().toString()
  );
  
  return (
    <View>
      <Text>{hasPlan ? 'Has Plan' : 'No Plan'}</Text>
      <Text>{hasMultiplePlans ? 'Multiple Plans' : 'Single Plan'}</Text>
      <Text>{isRest ? 'Rest Day' : 'Training Day'}</Text>
    </View>
  );
};
```

### 10. Plan Navigation
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';
import { useNavigation } from '@react-navigation/native';

export const PlanNavigator = () => {
  const { selectedPlan } = useWorkoutPlans();
  const navigation = useNavigation();
  
  const goToExerciseDetail = (exercise) => {
    navigation.navigate('ExerciseDetail', { 
      exercise,
      // Plan is available globally, no need to pass
    });
  };
  
  return (
    <View>
      {selectedPlan?.workoutSet?.flatMap(w => w.workoutexerciseSet || [])
        .map((ex, i) => (
          <TouchableOpacity 
            key={i}
            onPress={() => goToExerciseDetail(ex.exercise)}
          >
            <Text>{ex.exercise?.name}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};
```

---

## Quick Lookups

### Get Property
```javascript
selectedPlan?.label          // "Push Day"
selectedPlan?.id             // 1
selectedPlan?.value          // "1"
selectedPlan?.workoutSet     // Array of workouts
allPlans.length              // Number of plans
```

### Filter
```javascript
// By day
workoutSet?.find(w => w.day === "0")

// By exercise name
.flatMap(w => w.workoutexerciseSet)?.find(e => e.exercise?.name === "Bench")

// By equipment
.flatMap(w => w.workoutexerciseSet)?.filter(e => e.exercise?.equipment === "Barbell")
```

### Map
```javascript
// Get all exercise names
allExercises.map(ex => ex.exercise?.name)

// Get all workout names
selectedPlan?.workoutSet?.map(w => w.name)

// Get all targets
allExercises.map(ex => ex.exercise?.target)
```

---

## Common Patterns

### Conditional Rendering
```javascript
{selectedPlan ? <PlanView /> : <NoPlansMessage />}
{allPlans.length > 0 ? <PlanList /> : <CreatePlanButton />}
{todayWorkout ? <WorkoutDetail /> : <RestDayMessage />}
```

### Loading State
```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (selectedPlan) {
    setLoading(false);
  }
}, [selectedPlan]);

{loading ? <Spinner /> : <Content />}
```

### Error Handling
```javascript
try {
  await updateWorkoutPlans(newPlan, allPlans);
  Alert.alert('Success', 'Plan updated');
} catch (error) {
  Alert.alert('Error', 'Failed to update plan');
}
```

---

## Debug Helpers

### Log Everything
```javascript
const { selectedPlan, allPlans } = useWorkoutPlans();

console.log('=== PLAN DEBUG ===');
console.log('Selected:', selectedPlan?.label);
console.log('Total Plans:', allPlans.length);
console.log('Plan ID:', selectedPlan?.id);
console.log('Workouts:', selectedPlan?.workoutSet?.length);
console.log('Full Plan:', selectedPlan);
console.log('All Plans:', allPlans);
```

### Inspect Exercise
```javascript
const exercise = selectedPlan?.workoutSet[0]?.workoutexerciseSet[0];
console.log(exercise);
// {
//   suggestedSets: 4,
//   suggestedReps: "8-10",
//   exercise: {
//     id: 1,
//     name: "Bench Press",
//     maleVideo: "url",
//     femaleVideo: "url",
//     description: "...",
//     equipment: "Barbell",
//     target: "Chest"
//   }
// }
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot read 'label' of null` | Add `selectedPlan ?` check |
| `allPlans is undefined` | Import hook: `import { useWorkoutPlans }` |
| `updateWorkoutPlans is not a function` | Destructure: `const { updateWorkoutPlans }` |
| `Day mismatch` | Convert to string: `dayIndex.toString()` |
| `No exercises` | Check: `workoutexerciseSet?.length > 0` |

---

## That's It!

Copy, paste, customize, and go! 🚀

For more info, see:
- `WORKOUT_PLANS_CONTEXT_GUIDE.md` - Full documentation
- `WORKOUT_PLANS_QUICK_REFERENCE.md` - Quick lookup

