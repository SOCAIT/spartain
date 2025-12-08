# Workout Plans in AuthContext - Setup Guide

## Overview
Workout plans are now accessible globally across your entire app through AuthContext. This means any screen can access the user's selected plan and all available plans without prop drilling or redundant API calls.

## What Was Changed

### 1. **AuthContext Updates** (`helpers/AuthContext.js`)
Added two new properties to `authState`:
- `selectedPlan`: The currently selected workout plan object
- `allPlans`: Array of all available workout plans for the user

Added new function:
- `updateWorkoutPlans(selectedPlan, allPlans)`: Updates and persists plan data

### 2. **New Hook** (`helpers/useWorkoutPlans.js`)
Simple custom hook for accessing workout plans from any screen:
```javascript
const { selectedPlan, allPlans, updateWorkoutPlans } = useWorkoutPlans();
```

### 3. **WorkoutPlanScreen Updates**
Updated to sync with AuthContext:
- Plans are saved to context when fetched
- Selected plan is saved when user changes plans
- Plans persist across app restarts (via AsyncStorage)

## How to Use in Other Screens

### Method 1: Using the Custom Hook (Recommended)

```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

const MyScreen = () => {
  const { selectedPlan, allPlans, updateWorkoutPlans } = useWorkoutPlans();
  
  // Use the plan data
  useEffect(() => {
    if (selectedPlan) {
      console.log('Current plan:', selectedPlan.label);
      console.log('Plan workouts:', selectedPlan.workoutSet);
    }
  }, [selectedPlan]);
  
  return (
    <View>
      <Text>Selected Plan: {selectedPlan?.label}</Text>
    </View>
  );
};
```

### Method 2: Using AuthContext Directly

```javascript
import { useContext } from 'react';
import { AuthContext } from '../../helpers/AuthContext';

const MyScreen = () => {
  const { authState, updateWorkoutPlans } = useContext(AuthContext);
  
  const selectedPlan = authState?.selectedPlan;
  const allPlans = authState?.allPlans;
  
  return (
    <View>
      <Text>Selected Plan: {selectedPlan?.label}</Text>
    </View>
  );
};
```

## Data Structure

### Selected Plan Object
```javascript
{
  value: "plan-id-123",          // Unique identifier
  label: "Push Day",             // Display name
  id: 1,
  name: "Push Day",
  workoutSet: [                  // Array of workouts for each day
    {
      day: "0",                  // Day index (0-6 for Mon-Sun)
      name: "Monday Push",
      workoutexerciseSet: [
        {
          suggestedReps: "8-10",
          suggestedSets: 4,
          exercise: {
            id: 1,
            name: "Bench Press",
            maleVideo: "url",
            femaleVideo: "url",
            description: "...",
            equipment: "Barbell",
            target: "Chest"
          }
        }
        // ... more exercises
      ]
    }
    // ... more days
  ]
}
```

### All Plans Array
Array of all plan objects with the same structure as above.

## Accessing Specific Data

### Get Current Day's Workout
```javascript
const { selectedPlan } = useWorkoutPlans();

const currentDay = new Date().getDay();
const dayIndex = currentDay === 0 ? 6 : currentDay - 1;

const todayWorkout = selectedPlan?.workoutSet?.find(
  workout => workout.day === dayIndex.toString()
);
```

### Get All Exercises in Selected Plan
```javascript
const { selectedPlan } = useWorkoutPlans();

const allExercises = selectedPlan?.workoutSet?.flatMap(
  workout => workout.workoutexerciseSet || []
);
```

### Find Specific Exercise
```javascript
const { selectedPlan } = useWorkoutPlans();

const benchPress = selectedPlan?.workoutSet
  ?.flatMap(w => w.workoutexerciseSet || [])
  ?.find(ex => ex.exercise?.name === 'Bench Press');
```

## Persistence

Plans are automatically persisted to device storage via AsyncStorage:
- `selectedPlan` - Saved when user selects a plan
- `allPlans` - Saved when plans are fetched

When the app restarts:
1. AuthContext loads token
2. Restores saved plans from AsyncStorage
3. Plans are immediately available to all screens

### Clear Plans (e.g., on Logout)
Plans are automatically cleared when user logs out.

## Usage Examples

### Home Screen - Show Current Day Workout
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

const HomeScreen = () => {
  const { selectedPlan } = useWorkoutPlans();
  
  const getTodayWorkout = () => {
    const today = new Date();
    const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    return selectedPlan?.workoutSet?.find(w => w.day === dayIndex.toString());
  };
  
  const workout = getTodayWorkout();
  
  return (
    <View>
      {workout ? (
        <Text>Today's Workout: {workout.name}</Text>
      ) : (
        <Text>Rest Day</Text>
      )}
    </View>
  );
};
```

### Navigation - Pass Plan Data
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';
import { useNavigation } from '@react-navigation/native';

const ScreenA = () => {
  const { selectedPlan } = useWorkoutPlans();
  const navigation = useNavigation();
  
  const handleNavigate = () => {
    // No need to pass plan as prop - Screen B can access it from context
    navigation.navigate('ScreenB');
  };
  
  return (
    <TouchableOpacity onPress={handleNavigate}>
      <Text>Go to Screen B</Text>
    </TouchableOpacity>
  );
};

// In ScreenB - no props needed
const ScreenB = () => {
  const { selectedPlan } = useWorkoutPlans();
  
  return (
    <View>
      <Text>{selectedPlan?.label}</Text>
    </View>
  );
};
```

### Profile Screen - Show All Plans
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

const ProfileScreen = () => {
  const { allPlans, selectedPlan } = useWorkoutPlans();
  
  return (
    <View>
      <Text>Total Plans: {allPlans.length}</Text>
      <Text>Current: {selectedPlan?.label}</Text>
      
      <FlatList
        data={allPlans}
        keyExtractor={item => item.value}
        renderItem={({ item }) => (
          <Text 
            style={{
              fontWeight: item.value === selectedPlan?.value ? 'bold' : 'normal'
            }}
          >
            {item.label}
          </Text>
        )}
      />
    </View>
  );
};
```

## Technical Details

### How Updates Work
1. User selects a plan in WorkoutPlanScreen
2. `handlePlanChange()` calls `updateWorkoutPlans(plan, allPlans)`
3. Function saves to AsyncStorage and updates AuthContext
4. All subscribed components re-render with new data
5. Plan persists across app restarts

### Performance Notes
- Plans are only loaded once when user logs in
- No redundant API calls since data is cached
- Minimal re-renders - only affected screens update
- AsyncStorage operations are fast (<100ms)

### Debugging
Enable console logs in AuthContext:
```javascript
// In AuthContext.js updateWorkoutPlans function
console.log('[AuthContext] Updating workout plans:', {
  selectedPlanId: selectedPlan?.id,
  totalPlans: allPlans.length
});
```

## Troubleshooting

### Plans Not Updating
**Problem**: Selected plan doesn't update across screens
**Solution**: Make sure to call `updateWorkoutPlans()` when plan changes

### Plans Lost on App Restart
**Problem**: Plans disappear after closing app
**Solution**: Check that `AsyncStorage.setItem()` is being called in `updateWorkoutPlans()`

### Context Not Available
**Problem**: `useWorkoutPlans()` hook returns null/empty
**Solution**: Ensure component is wrapped in `AuthProvider` in App.tsx

### Type Errors
**Problem**: TypeScript errors with plan structure
**Solution**: Reference the Data Structure section above for correct shape

## Migration Guide (If Already Using Plans Differently)

If you were passing plans as props:

### Before
```javascript
// Screen A
<ScreenB selectedPlan={selectedPlan} allPlans={allPlans} />

// Screen B
const ScreenB = ({ selectedPlan, allPlans }) => {
  // ...
};
```

### After
```javascript
// Screen B
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

const ScreenB = () => {
  const { selectedPlan, allPlans } = useWorkoutPlans();
  // ...
};
```

## Files Modified

1. `helpers/AuthContext.js` - Added plan properties and updateWorkoutPlans function
2. `pages/Program/WorkoutPlanScreen.js` - Updated to save plans to context
3. **NEW**: `helpers/useWorkoutPlans.js` - Custom hook for easy access

## Summary

✅ **Benefits:**
- Access plans from any screen without props
- Plans persist across app sessions
- Single source of truth (AuthContext)
- Type-safe data structure
- Easy debugging with console logs

✅ **Implementation:**
- Use `useWorkoutPlans()` hook in any screen
- Or access directly via `AuthContext`
- Plans auto-update when user selects new plan
- Plans auto-persist to device storage

