# Workout Plans - Quick Reference

## Import & Use (Easiest Way)

```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

const MyScreen = () => {
  const { selectedPlan, allPlans, updateWorkoutPlans } = useWorkoutPlans();
  
  // Use it
  console.log(selectedPlan?.label);
  console.log(allPlans.length);
};
```

## Common Tasks

### Get Selected Plan
```javascript
const { selectedPlan } = useWorkoutPlans();
console.log(selectedPlan); // Full plan object
```

### Get All Plans
```javascript
const { allPlans } = useWorkoutPlans();
console.log(allPlans); // Array of plans
```

### Get Today's Workout
```javascript
const { selectedPlan } = useWorkoutPlans();

const today = new Date().getDay();
const dayIndex = today === 0 ? 6 : today - 1;
const todayWorkout = selectedPlan?.workoutSet?.find(w => w.day === dayIndex.toString());
```

### Get All Exercises in Plan
```javascript
const { selectedPlan } = useWorkoutPlans();

const allExercises = selectedPlan?.workoutSet?.flatMap(
  w => w.workoutexerciseSet || []
);
```

### Find Exercise by Name
```javascript
const { selectedPlan } = useWorkoutPlans();

const exercise = selectedPlan?.workoutSet
  ?.flatMap(w => w.workoutexerciseSet || [])
  ?.find(ex => ex.exercise?.name === 'Bench Press');
```

### Update Plan (After User Selection)
```javascript
const { updateWorkoutPlans } = useWorkoutPlans();

await updateWorkoutPlans(newSelectedPlan, allPlans);
```

## Plan Object Structure

```
selectedPlan: {
  value: "id",
  label: "Plan Name",
  workoutSet: [
    {
      day: "0",
      name: "Day Name",
      workoutexerciseSet: [
        {
          exercise: {
            id, name, maleVideo, femaleVideo, description, etc
          },
          suggestedSets, suggestedReps
        }
      ]
    }
  ]
}
```

## Access From Multiple Screens

```javascript
// Screen 1
const { selectedPlan } = useWorkoutPlans();

// Screen 2 - Same data, no props needed
const { selectedPlan } = useWorkoutPlans();

// Screen 3 - Also has access
const { selectedPlan } = useWorkoutPlans();
```

## Conditional Rendering

```javascript
const { selectedPlan } = useWorkoutPlans();

return (
  <>
    {selectedPlan ? (
      <Text>{selectedPlan.label}</Text>
    ) : (
      <Text>No plan selected</Text>
    )}
  </>
);
```

## Loop Through Days

```javascript
const { selectedPlan } = useWorkoutPlans();

{selectedPlan?.workoutSet?.map((workout) => (
  <View key={workout.day}>
    <Text>{workout.name}</Text>
  </View>
))}
```

## Display All Plans Dropdown

```javascript
const { allPlans, selectedPlan, updateWorkoutPlans } = useWorkoutPlans();

<Picker
  selectedValue={selectedPlan?.value}
  onValueChange={(planValue) => {
    const plan = allPlans.find(p => p.value === planValue);
    updateWorkoutPlans(plan, allPlans);
  }}
>
  {allPlans.map(plan => (
    <Picker.Item key={plan.value} label={plan.label} value={plan.value} />
  ))}
</Picker>
```

## Check if Plan Exists

```javascript
const { selectedPlan, allPlans } = useWorkoutPlans();

const hasPlan = selectedPlan && selectedPlan.id;
const hasMultiplePlans = allPlans.length > 1;
```

## Navigate with Plan Data

```javascript
const { selectedPlan } = useWorkoutPlans();
const navigation = useNavigation();

navigation.navigate('ExerciseDetail', {
  exercise: selectedExercise,
  plan: selectedPlan  // Can pass if needed (though not required)
});
```

## TypeScript Types (Optional)

```typescript
interface IExercise {
  id: number;
  name: string;
  maleVideo: string;
  femaleVideo: string;
  description: string;
  equipment: string;
  target: string;
}

interface IWorkoutExercise {
  exercise: IExercise;
  suggestedSets: number;
  suggestedReps: string;
}

interface IWorkout {
  day: string;
  name: string;
  workoutexerciseSet: IWorkoutExercise[];
}

interface IWorkoutPlan {
  id: number;
  value: string;
  label: string;
  name: string;
  workoutSet: IWorkout[];
}
```

## Debugging

```javascript
const { selectedPlan, allPlans } = useWorkoutPlans();

// Log everything
console.log('Selected Plan:', selectedPlan);
console.log('All Plans:', allPlans);
console.log('Total Plans:', allPlans.length);
console.log('Current Plan ID:', selectedPlan?.id);
console.log('Workouts in Plan:', selectedPlan?.workoutSet?.length);
```

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read property 'label' of null` | selectedPlan is null | Check `if (selectedPlan)` first |
| `allPlans is undefined` | Hook not initialized | Import `useWorkoutPlans` |
| `updateWorkoutPlans is not a function` | Destructuring error | Use `const { updateWorkoutPlans }` |
| `Day returns undefined` | Wrong day format | Use `dayIndex.toString()` for comparison |

## Files Reference

- **Use the hook**: `helpers/useWorkoutPlans.js`
- **Main context**: `helpers/AuthContext.js`
- **WorkoutPlanScreen**: `pages/Program/WorkoutPlanScreen.js`

---

That's it! The plans are now globally accessible. Any questions? Check `WORKOUT_PLANS_CONTEXT_GUIDE.md` for detailed docs.

