import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { AuthContext } from '../helpers/AuthContext';

// RevenueCat-driven subscription hook
// - Uses offerings to show monthly/annual
// - Purchases via RevenueCat SDK
// - Gates features by checking entitlements.active['premium']
// - Keeps AuthContext in sync (isSubscribed + expiry)

export const useSubscriptionRevenueCat = () => {
  const { updateSubscriptionStatus } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentOffering, setCurrentOffering] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);

  const listenerAttached = useRef(false);

  useEffect(() => {
    // Attach a single global listener for customer info updates
    if (!listenerAttached.current) {
      try {
        Purchases.addCustomerInfoUpdateListener((info) => {
          
          const pro = info?.entitlements?.active?.["Pro"];
          const isPro = !!pro;
          const expiry = (pro)?.expirationDate || null;

          console.log('pro', pro);
          console.log('isPro', isPro);
          console.log('expiry', expiry);
          setIsSubscribed(isPro);
          setSubscriptionExpiry(expiry);
          // Keep AuthContext in sync
          updateSubscriptionStatus(isPro, expiry || null);
        });
        listenerAttached.current = true;
      } catch (_) {}
    }

    // Load initial state
    (async () => {
      try {
        await refreshOfferings();
        await refreshSubscriptionStatus();
      } catch (_) {}
    })();
  }, []);

  const refreshOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current || null;
    setCurrentOffering(current);
    return current;
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
      let isPro = !!customerInfo?.entitlements?.active?.["Pro"];
      let expiry = customerInfo?.entitlements?.active?.["Pro"]?.expirationDate || null;

      // Ensure backend sync completed and fetch latest
      try {
        await Purchases.syncPurchases();
        const latest = await Purchases.getCustomerInfo();
        const ent = latest?.entitlements?.active?.["Pro"];
        if (ent) {
          isPro = true;
          expiry = (ent)?.expirationDate || expiry;
        }
      } catch (_) {}

      if (isPro) {
        setIsSubscribed(true);
        setSubscriptionExpiry(expiry);
        await updateSubscriptionStatus(true, expiry);
        setShowSubscriptionModal(false);
        Alert.alert('Purchase successful!', 'Thanks for subscribing.');
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      // userCancelled is available in some platforms
      if (e?.userCancelled) return { success: false, cancelled: true };
      console.warn('RevenueCat purchase error:', e);
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
      const isPro = !!customerInfo?.entitlements?.active?.["Pro"];
      const expiry = customerInfo?.entitlements?.active?.["Pro"]?.expirationDate || null;
      setIsSubscribed(isPro);
      setSubscriptionExpiry(expiry);
      await updateSubscriptionStatus(isPro, expiry);
      Alert.alert(isPro ? 'Purchases Restored' : 'No Purchases Found', isPro ? 'Subscription restored.' : 'No active subscription found to restore.');
      return { success: isPro };
    } catch (e) {
      console.warn('RevenueCat restore error:', e);
      Alert.alert('Restore Error', e?.message || 'Failed to restore purchases.');
      return { success: false, error: e?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      const pro = info?.entitlements?.active?.["Pro"];
      const isPro = !!pro;
      const expiry = (pro)?.expirationDate || null;

      console.log('pro', pro);
      console.log('isPro', isPro);
      console.log('expiry', expiry);
      setIsSubscribed(isPro);
      setSubscriptionExpiry(expiry);
      await updateSubscriptionStatus(isPro, expiry);
      return { isValid: isPro, source: 'revenuecat', expiryDate: expiry, lastChecked: new Date().toISOString() };
    } catch (e) {
      console.warn('RevenueCat getCustomerInfo error:', e);
      setIsSubscribed(false);
      setSubscriptionExpiry(null);
      await updateSubscriptionStatus(false, null);
      return { isValid: false, source: 'revenuecat', error: e?.message };
    }
  };

  // Alias for compatibility with previous hook naming
  const validateSubscriptionStatus = refreshSubscriptionStatus;

  const premiumFeatures = useMemo(() => [
    'ai_agent',
    'workout_plans',
    'nutrition_plans',
    'exercise_library',
    'meal_tracking',
    'progress_tracking'
  ], []);

  const checkSubscription = async (feature) => {
    if (!premiumFeatures.includes(feature)) return true;
    const info = await Purchases.getCustomerInfo();
    const hasPremium = !!info?.entitlements?.active?.["Pro"];
    if (!hasPremium) setShowSubscriptionModal(true);
    return hasPremium;
  };

  const openManageSubscriptions = async (isYearly = false) => {
    try {
      if (Platform.OS === 'ios') {
        const appStoreUrl = 'itms-apps://apps.apple.com/account/subscriptions';
        const httpsUrl = 'https://apps.apple.com/account/subscriptions';
        try {
          const canOpen = await Linking.canOpenURL(appStoreUrl);
          if (canOpen) return await Linking.openURL(appStoreUrl);
        } catch (_) {}
        return await Linking.openURL(httpsUrl);
      }
      // Android
      const packageName = 'com.spartain';
      const sku = isYearly ? 'syntrafit_sub_yearly_2' : 'syntrafit_sub_monthly_2';
      const url = `https://play.google.com/store/account/subscriptions?sku=${encodeURIComponent(sku)}&package=${encodeURIComponent(packageName)}`;
      const fallbackUrl = 'https://play.google.com/store/account/subscriptions';
      const canOpen = await Linking.canOpenURL(url);
      return await Linking.openURL(canOpen ? url : fallbackUrl);
    } catch (e) {
      console.warn('Failed to open manage subscriptions:', e);
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


