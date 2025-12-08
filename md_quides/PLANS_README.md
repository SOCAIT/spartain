# 🏋️ Workout Plans - Global Context System

> **Access your workout plans from ANY screen in your app without props or prop drilling**

## ⚡ Quick Start (30 seconds)

```javascript
// Step 1: Import
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

// Step 2: Use
const MyScreen = () => {
  const { selectedPlan, allPlans } = useWorkoutPlans();
  
  // Step 3: Done!
  return <Text>{selectedPlan?.label}</Text>;
};
```

That's it! Your screen now has access to all workout plans.

---

## 🎯 What This Does

✅ **Global Plans** - Access plans from any screen  
✅ **No Props** - Stop prop drilling  
✅ **Auto-Save** - Plans persist across app restarts  
✅ **Simple** - One hook import, instant access  
✅ **Scalable** - Works for any number of screens  

---

## 📖 Documentation

| Document | Purpose | Time |
|----------|---------|------|
| **PLANS_INTEGRATION_COMPLETE.md** | Overview & getting started | 10 min |
| **PLANS_CHEAT_SHEET.md** | Copy-paste code examples | 5 min |
| **PLANS_DOCUMENTATION_INDEX.md** | Navigation hub | 2 min |
| **WORKOUT_PLANS_CONTEXT_GUIDE.md** | Complete guide | 20 min |
| **WORKOUT_PLANS_QUICK_REFERENCE.md** | Quick lookup | As needed |

**👉 Start with:** `PLANS_DOCUMENTATION_INDEX.md`

---

## 💻 Common Usage

### Display Current Plan
```javascript
const { selectedPlan } = useWorkoutPlans();
<Text>{selectedPlan?.label}</Text>
```

### Get Today's Workout
```javascript
const { selectedPlan } = useWorkoutPlans();
const today = new Date().getDay();
const idx = today === 0 ? 6 : today - 1;
const workout = selectedPlan?.workoutSet?.find(w => w.day === idx.toString());
```

### List All Plans
```javascript
const { allPlans } = useWorkoutPlans();
{allPlans.map(plan => <Text key={plan.id}>{plan.label}</Text>)}
```

### Update Selected Plan
```javascript
const { updateWorkoutPlans, allPlans } = useWorkoutPlans();
await updateWorkoutPlans(newPlan, allPlans);
```

---

## 🏗️ How It Works

```
AuthContext
  └─ selectedPlan & allPlans
       └─ AsyncStorage (Persistence)
            └─ useWorkoutPlans() Hook
                 └─ Your Screen
```

1. Plans stored in AuthContext
2. Automatically saved to AsyncStorage
3. Restored on app restart
4. Access anywhere with `useWorkoutPlans()` hook

---

## 📂 Files Changed

### Modified (3 files)
- `helpers/AuthContext.js` - Added plan properties & updateWorkoutPlans()
- `pages/Program/WorkoutPlanScreen.js` - Saves plans to context
- `helpers/useWorkoutPlans.js` - NEW hook for accessing plans

### Documentation (7 files)
- `PLANS_INTEGRATION_COMPLETE.md`
- `PLANS_CHEAT_SHEET.md`
- `WORKOUT_PLANS_CONTEXT_GUIDE.md`
- `WORKOUT_PLANS_QUICK_REFERENCE.md`
- `BEFORE_AND_AFTER_COMPARISON.md`
- `PLANS_CONTEXT_IMPLEMENTATION_SUMMARY.md`
- `PLANS_DOCUMENTATION_INDEX.md`

---

## ✨ Features

| Feature | Benefit |
|---------|---------|
| 🌍 Global State | Access from anywhere |
| 💾 Auto-Persistence | Survives app restart |
| 🎣 Simple Hook | Just import and use |
| 🚫 No Props | Skip prop drilling |
| 🔄 Auto-Sync | All screens stay in sync |
| 🐛 Easy Debug | Simple data structure |

---

## 🧪 Test It

```javascript
// Test 1: Does it work in my screen?
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';

const TestScreen = () => {
  const { selectedPlan, allPlans } = useWorkoutPlans();
  
  useEffect(() => {
    console.log('Plans:', { selectedPlan, allPlans });
  }, []);
  
  return <Text>Check console</Text>;
};
```

---

## 🆘 Troubleshooting

**Can't find plans?**  
→ Make sure component is in AuthProvider (in App.tsx)

**Getting null errors?**  
→ Add null check: `selectedPlan?.label`

**Import not working?**  
→ Check path: `import { useWorkoutPlans } from '../../helpers/useWorkoutPlans'`

**Plans not persisting?**  
→ Should be automatic - they persist via AsyncStorage

See **PLANS_DOCUMENTATION_INDEX.md** for more help.

---

## 🚀 Next Steps

1. Pick a screen to update
2. Import the hook
3. Use `selectedPlan` or `allPlans`
4. Test it works
5. Add to more screens

---

## 💡 Why This Matters

**Before**: 
```javascript
// Prop drilling 😞
<Screen1>
  <Screen2 plans={plans}>
    <Screen3 plans={plans}>
      <Component plans={plans} />
```

**After**:
```javascript
// Direct access 😊
import { useWorkoutPlans } from '...';
const { selectedPlan } = useWorkoutPlans();
```

---

## 📊 Architecture

```
App.tsx
  └─ AuthProvider
       └─ AuthContext
            ├─ selectedPlan ──┐
            ├─ allPlans ──────┼─ useWorkoutPlans() Hook
            └─ updateWorkoutPlans() ──┤
                                 └─ Any Screen
```

Simple, clean, scalable.

---

## 🎓 Learn More

- **How do I...?** → Check `PLANS_CHEAT_SHEET.md`
- **I need an example** → Look in `WORKOUT_PLANS_QUICK_REFERENCE.md`
- **I want details** → Read `WORKOUT_PLANS_CONTEXT_GUIDE.md`
- **Lost?** → See `PLANS_DOCUMENTATION_INDEX.md`

---

## ✅ Checklist

- ✅ Implementation complete
- ✅ Documentation comprehensive
- ✅ Zero linting errors
- ✅ Examples provided
- ✅ Ready to use

---

## 🎉 You're All Set!

Everything is ready. Start using plans in your screens!

```javascript
import { useWorkoutPlans } from '../../helpers/useWorkoutPlans';
const { selectedPlan } = useWorkoutPlans();
```

---

## 📞 Questions?

Check the docs - there are 7 comprehensive guides covering every aspect!

1. `PLANS_DOCUMENTATION_INDEX.md` - Where to find what
2. `PLANS_CHEAT_SHEET.md` - Code examples
3. `WORKOUT_PLANS_QUICK_REFERENCE.md` - Quick answers
4. `WORKOUT_PLANS_CONTEXT_GUIDE.md` - Full reference

---

**Status**: ✅ Complete  
**Quality**: ✅ Production Ready  
**Documentation**: ✅ Comprehensive  

Happy coding! 🚀

