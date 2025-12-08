# 🔧 Subscription System - Action Plan & Code Fixes

## 🎯 Goal
Fix all critical subscription issues to ensure secure, consistent subscription validation across your app.

---

## 📅 PHASE 1: CRITICAL FIXES (TODAY - 2 hours)

### Step 1: Verify RevenueCat Entitlement Name (15 minutes)

**Action:**
1. Log into [RevenueCat Dashboard](https://app.revenuecat.com)
2. Navigate to your project → Entitlements
3. Write down the EXACT entitlement identifier (case-sensitive)
4. Common identifiers: `"Pro"`, `"premium"`, `"premium_access"`

**Expected Result:** You'll know the correct entitlement name to use everywhere.

---

### Step 2: Create Subscription Constants File (10 minutes)

**Create:** `config/subscription.js`

```javascript
// config/subscription.js
/**
 * RevenueCat Subscription Configuration
 * IMPORTANT: These values must match EXACTLY with RevenueCat Dashboard
 */

// Entitlement identifier from RevenueCat Dashboard
export const ENTITLEMENT_ID = "Pro"; // ⚠️ VERIFY THIS IN YOUR DASHBOARD

// Product IDs (must match App Store Connect / Google Play Console)
export const PRODUCT_IDS = {
  MONTHLY: "syntrafit_sub_monthly_2",
  YEARLY: "syntrafit_sub_yearly_2"
};

// Premium features requiring subscription
export const PREMIUM_FEATURES = [
  'ai_agent',
  'workout_plans',
  'nutrition_plans',
  'exercise_library',
  'meal_tracking',
  'progress_tracking'
];

// RevenueCat API Keys
export const REVENUECAT_KEYS = {
  ios: 'appl_KHUmUupOtJXSBnhSNbxpSyzZnOd',
  android: 'google_D3E15744'
};
```

---

### Step 3: Fix useSubscription.revenuecat.js (30 minutes)

**Update:** `hooks/useSubscription.revenuecat.js`

```javascript
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { AuthContext } from '../helpers/AuthContext';
import { ENTITLEMENT_ID, PREMIUM_FEATURES } from '../config/subscription';

/**
 * RevenueCat Subscription Hook
 * - Single source of truth for subscription status
 * - Uses RevenueCat entitlements exclusively
 * - Syncs with AuthContext for app-wide access
 */
export const useSubscriptionRevenueCat = () => {
  const { updateSubscriptionStatus } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentOffering, setCurrentOffering] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);

  const listenerAttached = useRef(false);

  // Helper function to extract subscription info from CustomerInfo
  const extractSubscriptionInfo = (customerInfo) => {
    const entitlement = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
    const hasAccess = !!entitlement;
    const expiry = entitlement?.expirationDate || null;
    
    return { hasAccess, expiry, entitlement };
  };

  useEffect(() => {
    // Attach a single global listener for customer info updates
    if (!listenerAttached.current) {
      try {
        Purchases.addCustomerInfoUpdateListener((info) => {
          const { hasAccess, expiry } = extractSubscriptionInfo(info);
          
          console.log('[RevenueCat] Subscription updated:', {
            hasAccess,
            expiry,
            entitlementId: ENTITLEMENT_ID
          });

          setIsSubscribed(hasAccess);
          setSubscriptionExpiry(expiry);
          updateSubscriptionStatus(hasAccess, expiry);
        });
        listenerAttached.current = true;
      } catch (error) {
        console.error('[RevenueCat] Failed to attach listener:', error);
      }
    }

    // Load initial state
    (async () => {
      try {
        await refreshOfferings();
        await refreshSubscriptionStatus();
      } catch (error) {
        console.error('[RevenueCat] Initial load failed:', error);
      }
    })();
  }, []);

  const refreshOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings?.current || null;
      setCurrentOffering(current);
      return current;
    } catch (error) {
      console.error('[RevenueCat] Failed to refresh offerings:', error);
      return null;
    }
  };

  const getProductPrice = (isYearly = false) => {
    const pkg = isYearly ? currentOffering?.annual : currentOffering?.monthly;
    return pkg?.product?.priceString || (isYearly ? '€69.99' : '€8.99');
  };

  const handleSubscribe = async (isYearly = false, planType = 'Premium') => {
    if (planType === 'Free') {
      setShowSubscriptionModal(false);
      return { success: true, plan: 'Free' };
    }

    try {
      setIsLoading(true);
      const current = currentOffering || (await refreshOfferings());
      const selectedPackage = isYearly ? current?.annual : current?.monthly;
      
      if (!selectedPackage) {
        Alert.alert('Subscription', 'Plan not available yet. Try again later.');
        return { success: false, error: 'Package not available' };
      }

      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      const { hasAccess, expiry } = extractSubscriptionInfo(customerInfo);

      // Ensure backend sync completed and fetch latest
      try {
        await Purchases.syncPurchases();
        const latest = await Purchases.getCustomerInfo();
        const latestInfo = extractSubscriptionInfo(latest);
        
        if (latestInfo.hasAccess) {
          setIsSubscribed(true);
          setSubscriptionExpiry(latestInfo.expiry);
          await updateSubscriptionStatus(true, latestInfo.expiry);
          setShowSubscriptionModal(false);
          Alert.alert('Purchase successful!', 'Thanks for subscribing.');
          return { success: true };
        }
      } catch (syncError) {
        console.error('[RevenueCat] Sync failed:', syncError);
      }

      if (hasAccess) {
        setIsSubscribed(true);
        setSubscriptionExpiry(expiry);
        await updateSubscriptionStatus(true, expiry);
        setShowSubscriptionModal(false);
        Alert.alert('Purchase successful!', 'Thanks for subscribing.');
        return { success: true };
      }

      return { success: false, error: 'Subscription not activated' };
    } catch (e) {
      if (e?.userCancelled) {
        return { success: false, cancelled: true };
      }
      console.error('[RevenueCat] Purchase error:', e);
      Alert.alert('Purchase Error', e?.message || 'Failed to complete purchase.');
      return { success: false, error: e?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      const { customerInfo } = await Purchases.restorePurchases();
      const { hasAccess, expiry } = extractSubscriptionInfo(customerInfo);
      
      setIsSubscribed(hasAccess);
      setSubscriptionExpiry(expiry);
      await updateSubscriptionStatus(hasAccess, expiry);
      
      Alert.alert(
        hasAccess ? 'Purchases Restored' : 'No Purchases Found',
        hasAccess ? 'Subscription restored.' : 'No active subscription found to restore.'
      );
      
      return { success: hasAccess };
    } catch (e) {
      console.error('[RevenueCat] Restore error:', e);
      Alert.alert('Restore Error', e?.message || 'Failed to restore purchases.');
      return { success: false, error: e?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      const { hasAccess, expiry } = extractSubscriptionInfo(info);

      console.log('[RevenueCat] Subscription status:', { hasAccess, expiry });

      setIsSubscribed(hasAccess);
      setSubscriptionExpiry(expiry);
      await updateSubscriptionStatus(hasAccess, expiry);
      
      return {
        isValid: hasAccess,
        source: 'revenuecat',
        expiryDate: expiry,
        lastChecked: new Date().toISOString()
      };
    } catch (e) {
      console.error('[RevenueCat] Status refresh error:', e);
      setIsSubscribed(false);
      setSubscriptionExpiry(null);
      await updateSubscriptionStatus(false, null);
      return { isValid: false, source: 'revenuecat', error: e?.message };
    }
  };

  const validateSubscriptionStatus = refreshSubscriptionStatus;

  const premiumFeatures = useMemo(() => PREMIUM_FEATURES, []);

  const checkSubscription = async (feature) => {
    // Non-premium features are always accessible
    if (!premiumFeatures.includes(feature)) return true;

    try {
      const info = await Purchases.getCustomerInfo();
      const { hasAccess } = extractSubscriptionInfo(info);
      
      if (!hasAccess) {
        setShowSubscriptionModal(true);
      }
      
      return hasAccess;
    } catch (error) {
      console.error('[RevenueCat] Check subscription error:', error);
      // On error, default to showing subscription modal
      setShowSubscriptionModal(true);
      return false;
    }
  };

  const openManageSubscriptions = async (isYearly = false) => {
    try {
      if (Platform.OS === 'ios') {
        const appStoreUrl = 'itms-apps://apps.apple.com/account/subscriptions';
        const httpsUrl = 'https://apps.apple.com/account/subscriptions';
        
        try {
          const canOpen = await Linking.canOpenURL(appStoreUrl);
          if (canOpen) {
            await Linking.openURL(appStoreUrl);
            return true;
          }
        } catch (_) {}
        
        await Linking.openURL(httpsUrl);
        return true;
      }

      // Android
      const packageName = 'com.spartain';
      const sku = isYearly ? PRODUCT_IDS.YEARLY : PRODUCT_IDS.MONTHLY;
      const url = `https://play.google.com/store/account/subscriptions?sku=${encodeURIComponent(sku)}&package=${encodeURIComponent(packageName)}`;
      const fallbackUrl = 'https://play.google.com/store/account/subscriptions';
      
      const canOpen = await Linking.canOpenURL(url);
      await Linking.openURL(canOpen ? url : fallbackUrl);
      return true;
    } catch (e) {
      console.error('[RevenueCat] Failed to open manage subscriptions:', e);
      Alert.alert('Manage Subscription', 'Unable to open subscription management.');
      return false;
    }
  };

  return {
    // State
    isSubscribed,
    subscriptionExpiry,
    isLoading,
    showSubscriptionModal,
    setShowSubscriptionModal,

    // Pricing/offerings
    currentOffering,
    refreshOfferings,
    getProductPrice,

    // Actions
    handleSubscribe,
    restorePurchases,
    checkSubscription,
    refreshSubscriptionStatus,
    validateSubscriptionStatus,
    openManageSubscriptions,
  };
};

export default useSubscriptionRevenueCat;
```

---

### Step 4: Fix App.tsx RevenueCat Initialization (20 minutes)

**Update:** `App.tsx`

```typescript
// Add at the top with other imports
import { REVENUECAT_KEYS, ENTITLEMENT_ID } from './config/subscription';

// Replace REVENUECAT_API_KEY constant
const REVENUECAT_API_KEY = Platform.select(REVENUECAT_KEYS);

// Replace initRevenueCat function
export async function initRevenueCat(appUserId: string) {
  try {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (!appUserId || appUserId === "" || appUserId === "0") {
      console.warn('[RevenueCat] Cannot initialize with invalid user ID:', appUserId);
      return false;
    }

    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY as string,
      appUserID: appUserId // Set the user ID during configuration
    });

    console.log('[RevenueCat] Initialized successfully for user:', appUserId);
    return true;
  } catch (error) {
    console.error('[RevenueCat] Initialization failed:', error);
    return false;
  }
}

// In the App component, REPLACE the first useEffect:
useEffect(() => {
  runTest();
  getValueFor("accessToken", setToken);
  test_api();
  
  // Check and clear expired subscription data on app start
  const checkExpiredSubscription = async () => {
    try {
      const subscriptionExpiry = await AsyncStorage.getItem('subscriptionExpiry');
      if (subscriptionExpiry) {
        const expiryDate = new Date(subscriptionExpiry);
        const now = new Date();
        
        if (now > expiryDate) {
          console.log('[App] Found expired subscription, cleaning up...');
          await AsyncStorage.setItem('isSubscribed', 'false');
          await AsyncStorage.removeItem('subscriptionExpiry');
          console.log('[App] ✅ Expired subscription cleaned up');
        }
      }
    } catch (error) {
      console.error('[App] Error checking expired subscription:', error);
    }
  };
  
  checkExpiredSubscription();
}, []);

// ADD NEW useEffect for RevenueCat initialization (after user is loaded)
useEffect(() => {
  const initializeRevenueCat = async () => {
    // Only initialize after we have a valid user ID
    if (authState.id && authState.id !== 0) {
      const initialized = await initRevenueCat(String(authState.id));
      
      if (initialized) {
        // Listen for RevenueCat entitlement updates
        try {
          Purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
            const entitlement = info?.entitlements?.active?.[ENTITLEMENT_ID];
            const isPro = !!entitlement;
            const expiry = (entitlement as any)?.expirationDate || null;

            console.log('[App] RevenueCat update:', { isPro, expiry });
            
            setAuthState((prev: any) => ({
              ...prev,
              isSubscribed: isPro,
              subscriptionExpiry: expiry,
            }));
          });
        } catch (error) {
          console.error('[App] Failed to attach listener:', error);
        }

        // Fetch initial subscription status
        try {
          const info = await Purchases.getCustomerInfo();
          const entitlement = info?.entitlements?.active?.[ENTITLEMENT_ID];
          const isPro = !!entitlement;
          const expiry = (entitlement as any)?.expirationDate || null;
          
          if (isPro) {
            console.log('[App] User has active subscription');
            setAuthState((prev: any) => ({
              ...prev,
              isSubscribed: true,
              subscriptionExpiry: expiry
            }));
          }
        } catch (error) {
          console.error('[App] Failed to get initial customer info:', error);
        }
      }
    }
  };

  initializeRevenueCat();
}, [authState.id]); // Re-initialize when user changes
```

---

### Step 5: Update All Screens to Use Correct Hook (30 minutes)

**Files to Update:**
- `pages/Program/WorkoutPlanScreen.js`
- `pages/Nutrition/*` (all nutrition screens)
- Any other screens importing `useSubscription`

**Change:**
```javascript
// OLD (❌ DELETE):
import { useSubscription } from '../../hooks/useSubscription';
const { checkSubscription, ... } = useSubscription();

// NEW (✅ USE):
import { useSubscriptionRevenueCat } from '../../hooks/useSubscription.revenuecat';
const { checkSubscription, ... } = useSubscriptionRevenueCat();
```

**Add Subscription Check to Premium Screens:**

```javascript
// Add to WorkoutPlanScreen.js
import { useSubscriptionRevenueCat } from '../../hooks/useSubscription.revenuecat';
import SubscriptionModal from '../../components/SubscriptionModal';

const WorkoutPlanScreen = () => {
  const { checkSubscription, showSubscriptionModal, setShowSubscriptionModal } = useSubscriptionRevenueCat();
  
  // Add subscription check on mount
  useEffect(() => {
    const verifyAccess = async () => {
      const hasAccess = await checkSubscription('workout_plans');
      if (!hasAccess) {
        // Modal will show automatically
        console.log('[WorkoutPlan] No subscription, showing modal');
      }
    };
    verifyAccess();
  }, []);

  // ... rest of component

  return (
    <View>
      {/* Your existing UI */}
      
      {/* Add SubscriptionModal at the end */}
      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        navigation={navigation}
      />
    </View>
  );
};
```

---

### Step 6: Delete Old Subscription Hooks (5 minutes)

**Delete these files:**
```bash
rm hooks/useSubscription.js
rm "hooks/useSubscription copy.js"
```

---

### Step 7: Update AuthContext (20 minutes)

**Update:** `helpers/AuthContext.js`

```javascript
// REMOVE: All AsyncStorage-based subscription validation
// REMOVE: Lines 124-165 (loadSubscriptionStatus function and its calls)

// KEEP: Only updateSubscriptionStatus function (it's called by RevenueCat hook)

const updateSubscriptionStatus = async (isSubscribed, expiryDate = null) => {
  try {
    // Store in AsyncStorage for offline reference only (NOT for validation)
    await AsyncStorage.setItem('isSubscribed', isSubscribed.toString());
    if (expiryDate) {
      await AsyncStorage.setItem('subscriptionExpiry', expiryDate);
    } else {
      await AsyncStorage.removeItem('subscriptionExpiry');
    }
    
    setAuthState(prev => sanitizeAuthState({
      ...prev,
      isSubscribed,
      subscriptionExpiry: expiryDate,
      user: prev.user ? { ...prev.user, is_subscribed: isSubscribed } : prev.user,
    }));
    
    console.log('[AuthContext] Subscription status updated:', { isSubscribed, expiryDate });
  } catch (error) {
    console.error('[AuthContext] Error updating subscription status:', error);
  }
};
```

---

## ✅ Testing Checklist

After completing Phase 1, test the following:

### Test 1: Fresh Install
- [ ] Delete app from device
- [ ] Install fresh build
- [ ] Login
- [ ] Verify RevenueCat initializes with correct user ID
- [ ] Check console logs for initialization success

### Test 2: Subscription Purchase
- [ ] Navigate to subscription screen
- [ ] Attempt to purchase monthly plan
- [ ] Verify purchase completes
- [ ] Check that premium features are immediately accessible
- [ ] Verify `authState.isSubscribed` is true

### Test 3: Subscription Check
- [ ] Navigate to Chat screen
- [ ] Verify it allows access (if subscribed)
- [ ] Navigate to Workout Plan screen
- [ ] Verify it allows access (if subscribed)
- [ ] Clear subscription (using RevenueCat dashboard sandbox)
- [ ] Verify both screens show subscription modal

### Test 4: Restore Purchases
- [ ] Delete and reinstall app
- [ ] Login with same account
- [ ] Tap "Restore Purchases"
- [ ] Verify subscription is restored
- [ ] Verify premium features are accessible

---

## 📊 Verification Commands

Run these to verify your changes:

```bash
# Search for old hook usage (should return no results after fix)
grep -r "from.*useSubscription'" pages/ components/

# Search for entitlement name consistency
grep -r "entitlements.active" .

# Verify ENTITLEMENT_ID is imported everywhere
grep -r "ENTITLEMENT_ID" .
```

---

## 🚨 Common Mistakes to Avoid

1. ❌ Don't check `authState.isSubscribed` directly - always use `checkSubscription()`
2. ❌ Don't validate subscriptions using AsyncStorage - only use RevenueCat
3. ❌ Don't initialize RevenueCat before user is authenticated
4. ❌ Don't mix different subscription hooks in different screens
5. ❌ Don't forget to import `ENTITLEMENT_ID` constant

---

## 📅 PHASE 2: SECURITY FIXES (This Week - 4 hours)

### Backend Subscription Validation

Create endpoint: `backend/api/subscription/validate/`

```python
# Django example
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

@api_view(['GET'])
def validate_subscription(request):
    user_id = request.user.id
    
    # Call RevenueCat REST API
    rc_response = requests.get(
        f'https://api.revenuecat.com/v1/subscribers/{user_id}',
        headers={
            'Authorization': f'Bearer {REVENUECAT_SECRET_KEY}'
        }
    )
    
    if rc_response.status_code == 200:
        data = rc_response.json()
        has_subscription = 'Pro' in data.get('subscriber', {}).get('entitlements', {})
        
        return Response({
            'is_subscribed': has_subscription,
            'expiry': data.get('subscriber', {}).get('entitlements', {}).get('Pro', {}).get('expires_date'),
            'source': 'revenuecat_server'
        })
    
    return Response({'is_subscribed': False, 'source': 'error'})
```

---

## 🎉 Success Criteria

You'll know Phase 1 is successful when:

✅ All screens use `useSubscriptionRevenueCat` hook  
✅ Console shows "[RevenueCat] Initialized successfully for user: [ID]"  
✅ Premium features are properly gated  
✅ Subscription purchase works end-to-end  
✅ Restore purchases works  
✅ No more inconsistent subscription states  

---

## 📞 Need Help?

If you encounter issues:

1. Check RevenueCat dashboard for entitlement name
2. Check console logs for [RevenueCat] messages
3. Verify user ID is being passed correctly
4. Test in sandbox mode first
5. Contact RevenueCat support if SDK issues

---

*Action Plan Created: October 27, 2025*  
*Estimated Time: 2 hours for Phase 1*

