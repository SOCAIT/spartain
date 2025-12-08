# Dual Plans - Quick Reference

## Import Hook
```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';
```

## Get Both Plans
```javascript
const { selectedWorkoutPlan, selectedNutritionPlan, updateSelectedPlans } = useWorkoutPlans();
```

## Display Both
```javascript
<Text>{selectedWorkoutPlan?.label}</Text>
<Text>{selectedNutritionPlan?.label}</Text>
```

## Update Workout Plan Only
```javascript
updateSelectedPlans(newWorkoutPlan, selectedNutritionPlan);
```

## Update Nutrition Plan Only
```javascript
updateSelectedPlans(selectedWorkoutPlan, newNutritionPlan);
```

## Update Both Plans
```javascript
updateSelectedPlans(newWorkoutPlan, newNutritionPlan);
```

## Check if Plans Exist
```javascript
if (selectedWorkoutPlan) { /* has workout plan */ }
if (selectedNutritionPlan) { /* has nutrition plan */ }
```

## Safe Access
```javascript
selectedWorkoutPlan?.label  // Returns undefined if null
selectedNutritionPlan?.id   // Returns undefined if null
```

## In AsyncStorage
- Key: `selectedWorkoutPlan`
- Key: `selectedNutritionPlan`

## In AuthContext
```javascript
authState.selectedWorkoutPlan
authState.selectedNutritionPlan
```

---

That's it! Two plans, one hook, endless possibilities. 🚀

