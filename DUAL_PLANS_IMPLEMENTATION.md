# ✅ Dual Plans Implementation - Workout & Nutrition

## Updated! Now Supports BOTH Plan Types

You now have **two selected plans** in context:
1. **Workout Plan** - Selected by user in WorkoutPlanScreen
2. **Nutrition Plan** - Selected by user in NutritionPlanScreen

---

## 🎯 What's in Context Now

```javascript
authState: {
  selectedWorkoutPlan: {
    id: 1,
    label: "Push Day",
    value: 1,
    workoutSet: [...]
  },
  selectedNutritionPlan: {
    id: 2,
    label: "Keto Diet",
    value: 2,
    meals: [...]
  }
}
```

Both plans are **independently managed** and **auto-persisted** to AsyncStorage.

---

## 📝 How to Use

### Get Both Plans
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

const MyScreen = () => {
  const { selectedWorkoutPlan, selectedNutritionPlan } = useWorkoutPlans();
  
  return (
    <View>
      <Text>Workout: {selectedWorkoutPlan?.label}</Text>
      <Text>Nutrition: {selectedNutritionPlan?.label}</Text>
    </View>
  );
};
```

### Update Plans
```javascript
const { updateSelectedPlans, selectedNutritionPlan } = useWorkoutPlans();

// Update only workout plan (keep nutrition plan as is)
updateSelectedPlans(newWorkoutPlan, selectedNutritionPlan);

// Update both plans
updateSelectedPlans(newWorkoutPlan, newNutritionPlan);

// Update only nutrition plan (keep workout plan as is)
updateSelectedPlans(selectedWorkoutPlan, newNutritionPlan);
```

---

## 🔄 Data Flow

```
WorkoutPlanScreen
  ↓ selects workout plan
  └→ updateSelectedPlans(workoutPlan, currentNutritionPlan)
       ↓
     AuthContext → AsyncStorage
       ↓
   All screens can access both plans
```

---

## 🎯 Usage Patterns

### Home Screen - Show Both Plans
```javascript
const { selectedWorkoutPlan, selectedNutritionPlan } = useWorkoutPlans();

return (
  <View>
    <Text>Today's Workout: {selectedWorkoutPlan?.label}</Text>
    <Text>Today's Diet: {selectedNutritionPlan?.label}</Text>
  </View>
);
```

### Update Workout Plan Only
```javascript
const { selectedWorkoutPlan, selectedNutritionPlan, updateSelectedPlans } = useWorkoutPlans();

handleWorkoutChange = (newPlan) => {
  // Keep nutrition plan, update workout plan
  updateSelectedPlans(newPlan, selectedNutritionPlan);
};
```

### Update Nutrition Plan Only
```javascript
const { selectedWorkoutPlan, selectedNutritionPlan, updateSelectedPlans } = useWorkoutPlans();

handleNutritionChange = (newPlan) => {
  // Keep workout plan, update nutrition plan
  updateSelectedPlans(selectedWorkoutPlan, newPlan);
};
```

---

## 📱 Integration Points

### For Workout Plans
- **WorkoutPlanScreen.js** - Already integrated ✅
- Call: `updateSelectedPlans(newWorkoutPlan, selectedNutritionPlan)`

### For Nutrition Plans
- **NutritionPlanScreen.js** - Needs integration
- Call: `updateSelectedPlans(selectedWorkoutPlan, newNutritionPlan)`

---

## 🔧 Context Structure

```javascript
authState: {
  // ... other properties
  selectedWorkoutPlan: {
    id: number,
    value: number,
    label: string,
    name: string,
    workoutSet: array
  },
  selectedNutritionPlan: {
    id: number,
    value: number,
    label: string,
    name: string,
    meals: array
  }
}
```

---

## 💾 Persistence

Both plans are automatically persisted:

**AsyncStorage Keys:**
- `selectedWorkoutPlan` - Workout plan data
- `selectedNutritionPlan` - Nutrition plan data

**Behavior:**
- Auto-save when changed
- Auto-restore on app start
- Auto-clear on logout

---

## 🧪 Test It

```javascript
const { selectedWorkoutPlan, selectedNutritionPlan } = useWorkoutPlans();

useEffect(() => {
  console.log('Workout Plan:', selectedWorkoutPlan);
  console.log('Nutrition Plan:', selectedNutritionPlan);
}, [selectedWorkoutPlan, selectedNutritionPlan]);
```

---

## ✨ Benefits

✅ **Two Independent Plans** - Workout and nutrition managed separately  
✅ **Auto-Persistence** - Both saved across app restarts  
✅ **Global Access** - Use both from any screen  
✅ **Easy Updates** - Update one or both independently  
✅ **Clean API** - Simple, consistent function calls  

---

## 📊 Architecture

```
AuthContext
├── selectedWorkoutPlan
│   └── AsyncStorage: 'selectedWorkoutPlan'
│
├── selectedNutritionPlan
│   └── AsyncStorage: 'selectedNutritionPlan'
│
└── updateSelectedPlans(workout, nutrition)
    ├── Updates both
    ├── Saves to AsyncStorage
    └── Notifies all subscribers
```

---

## ✅ Complete!

Your app now supports **two selected plans** that are:
- ✅ Independently managed
- ✅ Globally accessible
- ✅ Auto-persisted
- ✅ Easy to update

**Integration Points:**
- ✅ WorkoutPlanScreen - Already done
- ⏳ NutritionPlanScreen - Next integration point

---

## 🚀 Next Steps

1. Integrate NutritionPlanScreen (if not already)
2. Use both plans in Home/Dashboard screens
3. Build features that leverage both plans together

All set! 🎉

