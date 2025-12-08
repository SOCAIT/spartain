# 🚀 Subscription Quick Reference Guide

## 🎯 TL;DR - What's Wrong & How to Fix

### The Problem
You have **3 different subscription hooks** checking subscriptions in **3 different ways**, some features aren't protected at all, and you're checking for entitlements with **inconsistent names** ("Pro" vs "premium").

### The Fix
1. Use ONE hook everywhere: `useSubscription.revenuecat.js`
2. Use ONE entitlement name: Verify in RevenueCat Dashboard
3. Delete the other 2 hooks
4. Add subscription checks to ALL premium features

**Time to Fix:** 2 hours  
**Difficulty:** Medium  
**Impact:** Critical - Fixes revenue loss and security issues

---

## 📋 Files You Need to Change

### 1. Create New File
- ✅ `config/subscription.js` - Centralized config

### 2. Update These Files
- ⚠️ `App.tsx` - Fix initialization timing
- ⚠️ `hooks/useSubscription.revenuecat.js` - Use constants
- ⚠️ `pages/chat/ChatbotScreenNew.js` - Already correct! ✅
- ⚠️ `pages/Program/WorkoutPlanScreen.js` - Change hook import
- ⚠️ `pages/Nutrition/*` - Add checks + change import
- ⚠️ `helpers/AuthContext.js` - Remove AsyncStorage validation

### 3. Delete These Files
- ❌ `hooks/useSubscription.js`
- ❌ `hooks/useSubscription copy.js`

---

## 🔍 Quick Checks

### Before You Start
```bash
# 1. Check which hook each screen uses
grep -r "useSubscription" pages/ components/

# 2. Find all entitlement checks
grep -r "entitlements.active" .

# 3. Verify you're on latest git branch
git status
```

### After You Fix
```bash
# 1. Should return NO results (old hooks deleted)
find . -name "useSubscription.js" -o -name "useSubscription copy.js"

# 2. Should find ONLY "useSubscription.revenuecat"
grep -r "from.*useSubscription" pages/ components/

# 3. Should find ONLY "ENTITLEMENT_ID"
grep -r "entitlements.active\[" .
```

---

## 📝 Code Snippets (Copy-Paste Ready)

### Snippet 1: Create Subscription Config

**File:** `config/subscription.js`
```javascript
export const ENTITLEMENT_ID = "Pro"; // ⚠️ VERIFY IN REVENUECAT DASHBOARD

export const PRODUCT_IDS = {
  MONTHLY: "syntrafit_sub_monthly_2",
  YEARLY: "syntrafit_sub_yearly_2"
};

export const PREMIUM_FEATURES = [
  'ai_agent',
  'workout_plans',
  'nutrition_plans',
  'exercise_library',
  'meal_tracking',
  'progress_tracking'
];

export const REVENUECAT_KEYS = {
  ios: 'appl_KHUmUupOtJXSBnhSNbxpSyzZnOd',
  android: 'google_D3E15744'
};
```

### Snippet 2: Import in Every Screen

**Replace this:**
```javascript
import { useSubscription } from '../../hooks/useSubscription';
```

**With this:**
```javascript
import { useSubscriptionRevenueCat } from '../../hooks/useSubscription.revenuecat';
```

### Snippet 3: Add Subscription Check to Premium Screens

**Add to top of component:**
```javascript
const { checkSubscription, showSubscriptionModal, setShowSubscriptionModal } = useSubscriptionRevenueCat();

useEffect(() => {
  const verifyAccess = async () => {
    const hasAccess = await checkSubscription('workout_plans'); // Change feature name
    if (!hasAccess) {
      console.log('[Screen] No subscription access');
    }
  };
  verifyAccess();
}, []);
```

**Add before closing tag:**
```javascript
<SubscriptionModal
  visible={showSubscriptionModal}
  onClose={() => setShowSubscriptionModal(false)}
  navigation={navigation}
/>
```

### Snippet 4: Fix App.tsx Initialization

**Replace this:**
```typescript
useEffect(() => {
  // ... other code
  initRevenueCat(authState.username); // ❌ WRONG - username is empty
}, []);
```

**With this:**
```typescript
useEffect(() => {
  const initializeRevenueCat = async () => {
    if (authState.id && authState.id !== 0) {
      await initRevenueCat(String(authState.id)); // ✅ CORRECT - use ID
    }
  };
  initializeRevenueCat();
}, [authState.id]); // ✅ Re-run when user changes
```

---

## 🎯 Feature-by-Feature Checklist

### Premium Features to Protect

- [ ] **AI Chat** (`pages/chat/ChatbotScreenNew.js`)
  - Status: ✅ Already protected
  - Feature: `'ai_agent'`

- [ ] **Workout Plans** (`pages/Program/WorkoutPlanScreen.js`)
  - Status: ⚠️ Uses wrong hook
  - Feature: `'workout_plans'`
  - Action: Change import + verify check

- [ ] **Nutrition Plans** (`pages/Nutrition/`)
  - Status: ❌ NOT PROTECTED
  - Feature: `'nutrition_plans'`
  - Action: Add hook + add check

- [ ] **Exercise Library** (`pages/Program/ExercisesScreen.js`)
  - Status: ❓ Check if exists
  - Feature: `'exercise_library'`
  - Action: Verify + add check if needed

- [ ] **Meal Tracking** (`pages/Nutrition/MealTrackingScreen.js`)
  - Status: ❓ Check if exists
  - Feature: `'meal_tracking'`
  - Action: Verify + add check if needed

- [ ] **Progress Tracking** (`pages/Body/`)
  - Status: ❓ Check if exists
  - Feature: `'progress_tracking'`
  - Action: Verify + add check if needed

---

## 🐛 Common Errors & Solutions

### Error 1: "Cannot read property 'active' of undefined"
**Cause:** Entitlement name doesn't match RevenueCat dashboard  
**Fix:** Verify exact entitlement name in dashboard

### Error 2: "User has no subscription after purchase"
**Cause:** RevenueCat initialized before user login  
**Fix:** Move initialization to after auth (use `authState.id`)

### Error 3: "Subscription works in Chat but not Workout"
**Cause:** Different screens using different hooks  
**Fix:** Update all imports to use `useSubscription.revenuecat`

### Error 4: "Subscription state not updating"
**Cause:** No listener attached or listener fires before hook mount  
**Fix:** Ensure listener is in useEffect with proper deps

### Error 5: "Error: Invalid user ID"
**Cause:** Passing empty string or "0" to RevenueCat  
**Fix:** Check `authState.id` exists before initializing

---

## 🧪 Testing Commands

### Test 1: Verify Hook Import
```bash
# Should show ONLY useSubscriptionRevenueCat
grep -r "import.*useSubscription" pages/ components/
```

### Test 2: Check Entitlement Name
```bash
# Should show ONLY ENTITLEMENT_ID usage
grep -r "entitlements.active" . | grep -v node_modules | grep -v ".git"
```

### Test 3: Find Unprotected Premium Screens
```bash
# Search for screens that might need protection
find pages/ -name "*.js" -o -name "*.tsx" | xargs grep -L "checkSubscription"
```

---

## 📞 RevenueCat Dashboard Checklist

### Things to Verify:

1. **Go to:** [app.revenuecat.com](https://app.revenuecat.com)

2. **Check Entitlements:**
   - Navigate to: Project → Entitlements
   - Write down EXACT name (case-sensitive)
   - Common names: "Pro", "premium", "premium_access"
   - ⚠️ Must match your code EXACTLY

3. **Check Products:**
   - Navigate to: Project → Products
   - Verify these exist:
     - `syntrafit_sub_monthly_2` (iOS & Android)
     - `syntrafit_sub_yearly_2` (iOS & Android)

4. **Check Product Links:**
   - Each product should be linked to your entitlement
   - If not linked, purchases won't grant access!

5. **Enable Sandbox Testing:**
   - Navigate to: Project → Settings
   - Enable Sandbox mode for testing

---

## 🎮 Testing Workflow

### Sandbox Testing (Before Production)

1. **Setup:**
   ```bash
   # Build in debug mode
   npm run ios  # or npm run android
   ```

2. **Create Sandbox Tester:**
   - iOS: App Store Connect → Users & Access → Sandbox Testers
   - Android: Google Play Console → License Testing

3. **Test Purchase:**
   - Log out of real Apple/Google account
   - Use sandbox tester credentials
   - Navigate to subscription screen
   - Purchase should complete instantly
   - Check logs for "[RevenueCat] Subscription updated"

4. **Test Restore:**
   - Delete app
   - Reinstall
   - Tap "Restore Purchases"
   - Should see success message
   - Premium features should be accessible

5. **Test Expiry:**
   - In RevenueCat dashboard, go to Customers
   - Find your test user
   - Revoke entitlement
   - App should update within seconds
   - Premium features should be blocked

### Production Testing (After Deploy)

1. **Real Purchase Test:**
   - Use personal account
   - Purchase smallest subscription
   - Verify access granted
   - Cancel subscription immediately (avoid charges)

2. **Monitor Dashboard:**
   - Check RevenueCat → Customers
   - Verify purchase appears
   - Check entitlement is granted

3. **User Reports:**
   - Monitor support tickets
   - Watch for subscription-related issues
   - Check analytics for subscription drop-offs

---

## 🔢 Environment Variables (Future Enhancement)

### Currently (Hardcoded)
```typescript
const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_XXX', // ⚠️ Exposed in code
  android: 'google_XXX'
});
```

### Better (Environment Variables)
```typescript
// .env file
REVENUECAT_IOS_KEY=appl_XXX
REVENUECAT_ANDROID_KEY=google_XXX

// App.tsx
import Config from 'react-native-config';
const REVENUECAT_API_KEY = Platform.select({
  ios: Config.REVENUECAT_IOS_KEY,
  android: Config.REVENUECAT_ANDROID_KEY
});
```

---

## 📊 Monitoring Checklist

### Daily Checks
- [ ] Check RevenueCat dashboard for new subscriptions
- [ ] Monitor error logs for subscription failures
- [ ] Check user support tickets

### Weekly Checks
- [ ] Review subscription metrics (churn, new, active)
- [ ] Check for unusual patterns
- [ ] Verify webhook deliveries (if set up)

### Monthly Checks
- [ ] Review revenue reports
- [ ] Analyze subscription conversion rates
- [ ] Check for trial abuse
- [ ] Review and update pricing if needed

---

## 🎯 Priority Order

### Do These First (Critical - 2 hours)
1. ✅ Create `config/subscription.js`
2. ✅ Verify entitlement name in RevenueCat dashboard
3. ✅ Update `useSubscription.revenuecat.js` to use constant
4. ✅ Fix `App.tsx` initialization
5. ✅ Update all screen imports
6. ✅ Delete old hooks

### Do These Next (Important - 2 hours)
1. ✅ Add subscription checks to unprotected screens
2. ✅ Remove AsyncStorage validation from AuthContext
3. ✅ Test in sandbox mode
4. ✅ Verify all features are properly gated

### Do These Later (Enhancement - 4 hours)
1. ✅ Move API keys to environment variables
2. ✅ Set up backend validation endpoint
3. ✅ Add subscription analytics
4. ✅ Implement webhook handling

---

## 💡 Pro Tips

1. **Always test in Sandbox first** - Real purchases cost real money!
2. **Use descriptive console logs** - Prefix with `[RevenueCat]` for easy filtering
3. **Document entitlement names** - Save yourself debugging time later
4. **One hook to rule them all** - Resist the urge to create multiple hooks
5. **RevenueCat is truth** - Never trust local storage for validation

---

## 🆘 Emergency Rollback

If something breaks in production:

```bash
# 1. Revert to previous commit
git log --oneline  # Find last good commit
git revert <commit-hash>

# 2. Emergency fix: Allow free access temporarily
# In useSubscriptionRevenueCat.js:
const checkSubscription = async (feature) => {
  return true; // ⚠️ TEMPORARY - Allows all access
};

# 3. Deploy emergency fix
npm run build
# Deploy to stores

# 4. Fix the real issue
# Then remove the temporary bypass
```

---

## 📚 Useful Links

- [RevenueCat Dashboard](https://app.revenuecat.com)
- [RevenueCat Docs - React Native](https://docs.revenuecat.com/docs/react-native)
- [RevenueCat Docs - Entitlements](https://docs.revenuecat.com/docs/entitlements)
- [RevenueCat Docs - Testing](https://docs.revenuecat.com/docs/testing)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

---

## 🎓 Learning Resources

1. **RevenueCat YouTube Channel** - Video tutorials
2. **RevenueCat Community** - Discord/Slack for questions
3. **React Native IAP Best Practices** - Community guides

---

*Quick Reference Guide Created: October 27, 2025*  
*Keep this handy during implementation!*

